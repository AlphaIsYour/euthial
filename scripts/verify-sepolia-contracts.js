#!/usr/bin/env node
/**
 * Verify all Sepolia contracts on Etherscan
 * 
 * Usage:
 *   node scripts/verify-sepolia-contracts.js
 * 
 * Requires:
 *   - ETHERSCAN_API_KEY in contracts/.env
 *   - Contracts already deployed to Sepolia
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ADDRESSES_JSON = path.join(__dirname, '../contracts/addresses.json');
const CONTRACTS_DIR = path.join(__dirname, '../contracts');

// Read deployed addresses
if (!fs.existsSync(ADDRESSES_JSON)) {
  console.error('❌ Error: addresses.json not found');
  console.error('Expected:', ADDRESSES_JSON);
  console.error('Run: pnpm run deploy:sepolia first');
  process.exit(1);
}

const addresses = JSON.parse(fs.readFileSync(ADDRESSES_JSON, 'utf8'));
const sepolia = addresses['11155111'];

if (!sepolia) {
  console.error('❌ Error: No Sepolia addresses found in addresses.json');
  process.exit(1);
}

console.log('========================================');
console.log('VERIFYING SEPOLIA CONTRACTS ON ETHERSCAN');
console.log('========================================');
console.log('Network: Ethereum Sepolia (11155111)');
console.log('Time:', new Date().toISOString());
console.log('');

// Contract verification configurations
const contracts = [
  {
    name: 'EuthialIDR',
    address: sepolia.euthialIDR,
    contractPath: 'src/EuthialIDR.sol:EuthialIDR',
    // Constructor args: (address admin, uint256 initialSupply)
    // We need to get these from deployment - using default values
    constructorArgs: null, // Will be encoded if needed
  },
  {
    name: 'SeniorVault',
    address: sepolia.seniorVault,
    contractPath: 'src/TrancheVault.sol:TrancheVault',
    // Constructor: (IERC20 _asset, string memory _name, string memory _symbol, address _owner)
    constructorArgs: null, // Complex - will use --guess flag
  },
  {
    name: 'JuniorVault',
    address: sepolia.juniorVault,
    contractPath: 'src/TrancheVault.sol:TrancheVault',
    constructorArgs: null,
  },
  {
    name: 'FitOutAgreement',
    address: sepolia.fitOutAgreement,
    contractPath: 'src/FitOutAgreement.sol:FitOutAgreement',
    constructorArgs: null, // Many constructor args - will use --guess
  },
  {
    name: 'WaterfallRouter',
    address: sepolia.waterfallRouter,
    contractPath: 'src/WaterfallRouter.sol:WaterfallRouter',
    constructorArgs: null,
  },
];

let successCount = 0;
let failCount = 0;
const results = [];

// Helper function to run forge command via PowerShell
function runForgeCommand(cmd, cwd) {
  const psCmd = `powershell.exe -NoProfile -Command "cd '${cwd}'; ${cmd}"`;
  return execSync(psCmd, {
    encoding: 'utf8',
    stdio: 'pipe',
    timeout: 120000, // 2 minutes timeout
  });
}

// Verify each contract
for (const contract of contracts) {
  console.log(`\n[${contracts.indexOf(contract) + 1}/${contracts.length}] Verifying ${contract.name}...`);
  console.log(`Address: ${contract.address}`);
  console.log(`Contract: ${contract.contractPath}`);
  
  try {
    const cmd = `forge verify-contract ${contract.address} ${contract.contractPath} --chain sepolia --watch`;
    
    console.log(`Running forge verify...`);
    
    // Execute verification via PowerShell
    const output = runForgeCommand(cmd, CONTRACTS_DIR);
    
    console.log(`✅ ${contract.name} verified successfully!`);
    results.push({ name: contract.name, status: 'SUCCESS', address: contract.address });
    successCount++;
    
  } catch (error) {
    const errorMsg = error.stderr || error.stdout || error.message;
    
    // Check if already verified
    if (errorMsg.includes('already verified') || errorMsg.includes('Already Verified') || errorMsg.includes('Contract source code already verified')) {
      console.log(`✅ ${contract.name} already verified`);
      results.push({ name: contract.name, status: 'ALREADY_VERIFIED', address: contract.address });
      successCount++;
    } else {
      console.error(`❌ ${contract.name} verification failed`);
      console.error('Error:', errorMsg.substring(0, 300));
      results.push({ name: contract.name, status: 'FAILED', address: contract.address, error: errorMsg.substring(0, 150) });
      failCount++;
    }
  }
  
  // Wait a bit between requests to avoid rate limiting
  if (contracts.indexOf(contract) < contracts.length - 1) {
    console.log('Waiting 5 seconds before next verification...');
    const start = Date.now();
    while (Date.now() - start < 5000) {
      // Busy wait for 5 seconds
    }
  }
}

// Summary
console.log('\n========================================');
console.log('VERIFICATION SUMMARY');
console.log('========================================');
console.log(`Total: ${contracts.length} contracts`);
console.log(`✅ Success: ${successCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log('');

results.forEach(result => {
  const icon = result.status === 'FAILED' ? '❌' : '✅';
  console.log(`${icon} ${result.name}: ${result.status}`);
  console.log(`   ${result.address}`);
  if (result.error) {
    console.log(`   Error: ${result.error}`);
  }
});

console.log('\n========================================');

if (failCount > 0) {
  console.log('\n⚠️  Some contracts failed verification.');
  console.log('You can verify manually at:');
  console.log('https://sepolia.etherscan.io/verifyContract');
  console.log('\nOr retry individual contracts:');
  results
    .filter(r => r.status === 'FAILED')
    .forEach(r => {
      const contract = contracts.find(c => c.name === r.name);
      console.log(`\nforge verify-contract ${r.address} ${contract.contractPath} --chain sepolia --watch`);
    });
  process.exit(1);
} else {
  console.log('\n🎉 All contracts verified successfully!');
  console.log('\nView contracts on Etherscan:');
  results.forEach(r => {
    console.log(`${r.name}: https://sepolia.etherscan.io/address/${r.address}#code`);
  });
}
