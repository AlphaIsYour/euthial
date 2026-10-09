# Verify Sepolia Contracts on Etherscan
# Usage: powershell -ExecutionPolicy Bypass -File scripts/verify-contracts.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFYING SEPOLIA CONTRACTS ON ETHERSCAN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Add Foundry to PATH
$env:Path += ";$env:USERPROFILE\.foundry\bin"

# Change to contracts directory
Set-Location "d:\Hackthon\euthial\contracts"

# Read addresses from addresses.json
$addresses = Get-Content "../contracts/addresses.json" | ConvertFrom-Json
$sepolia = $addresses.'11155111'

if (-not $sepolia) {
    Write-Host "Error: No Sepolia addresses found in addresses.json" -ForegroundColor Red
    exit 1
}

Write-Host "Network: Ethereum Sepolia (11155111)" -ForegroundColor Green
Write-Host "Time: $(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss.fffZ')" -ForegroundColor Green
Write-Host ""

# Contracts to verify
$contracts = @(
    @{
        Name = "EuthialIDR"
        Address = $sepolia.euthialIDR
        Path = "src/EuthialIDR.sol:EuthialIDR"
    },
    @{
        Name = "SeniorVault"
        Address = $sepolia.seniorVault
        Path = "src/TrancheVault.sol:TrancheVault"
    },
    @{
        Name = "JuniorVault"
        Address = $sepolia.juniorVault
        Path = "src/TrancheVault.sol:TrancheVault"
    },
    @{
        Name = "FitOutAgreement"
        Address = $sepolia.fitOutAgreement
        Path = "src/FitOutAgreement.sol:FitOutAgreement"
    },
    @{
        Name = "WaterfallRouter"
        Address = $sepolia.waterfallRouter
        Path = "src/WaterfallRouter.sol:WaterfallRouter"
    }
)

$successCount = 0
$failCount = 0
$results = @()

# Verify each contract
foreach ($contract in $contracts) {
    $index = $contracts.IndexOf($contract) + 1
    Write-Host "[$index/$($contracts.Count)] Verifying $($contract.Name)..." -ForegroundColor Yellow
    Write-Host "Address: $($contract.Address)" -ForegroundColor Gray
    Write-Host "Contract: $($contract.Path)" -ForegroundColor Gray
    
    try {
        $cmd = "forge verify-contract $($contract.Address) $($contract.Path) --chain sepolia --watch"
        Write-Host "Running: forge verify-contract..." -ForegroundColor Gray
        
        # Execute verification
        $output = & forge verify-contract $contract.Address $contract.Path --chain sepolia --watch 2>&1
        $exitCode = $LASTEXITCODE
        
        # Check output for success/failure
        $outputStr = $output | Out-String
        
        if ($outputStr -match "already verified" -or $outputStr -match "Contract source code already verified") {
            Write-Host "✅ $($contract.Name) already verified" -ForegroundColor Green
            $results += @{ Name = $contract.Name; Status = "ALREADY_VERIFIED"; Address = $contract.Address }
            $successCount++
        }
        elseif ($exitCode -eq 0 -or $outputStr -match "successfully verified") {
            Write-Host "✅ $($contract.Name) verified successfully!" -ForegroundColor Green
            $results += @{ Name = $contract.Name; Status = "SUCCESS"; Address = $contract.Address }
            $successCount++
        }
        else {
            throw "Verification failed"
        }
    }
    catch {
        $errorMsg = $_.Exception.Message
        if ($output) {
            $errorMsg = ($output | Out-String).Substring(0, [Math]::Min(200, ($output | Out-String).Length))
        }
        
        Write-Host "❌ $($contract.Name) verification failed" -ForegroundColor Red
        Write-Host "Error: $errorMsg" -ForegroundColor Red
        $results += @{ Name = $contract.Name; Status = "FAILED"; Address = $contract.Address; Error = $errorMsg }
        $failCount++
    }
    
    # Wait between requests
    if ($index -lt $contracts.Count) {
        Write-Host "Waiting 5 seconds..." -ForegroundColor Gray
        Start-Sleep -Seconds 5
    }
    
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total: $($contracts.Count) contracts"
Write-Host "✅ Success: $successCount" -ForegroundColor Green
Write-Host "❌ Failed: $failCount" -ForegroundColor Red
Write-Host ""

foreach ($result in $results) {
    if ($result.Status -eq "FAILED") {
        Write-Host "❌ $($result.Name): $($result.Status)" -ForegroundColor Red
    } else {
        Write-Host "✅ $($result.Name): $($result.Status)" -ForegroundColor Green
    }
    Write-Host "   $($result.Address)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($failCount -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Some contracts failed verification." -ForegroundColor Yellow
    Write-Host "Check ETHERSCAN_API_KEY in contracts/.env" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "View contracts on Etherscan:" -ForegroundColor Cyan
    foreach ($result in $results) {
        Write-Host "$($result.Name): https://sepolia.etherscan.io/address/$($result.Address)#code"
    }
    exit 1
}
else {
    Write-Host ""
    Write-Host "🎉 All contracts verified successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "View contracts on Etherscan:" -ForegroundColor Cyan
    foreach ($result in $results) {
        Write-Host "$($result.Name): https://sepolia.etherscan.io/address/$($result.Address)#code" -ForegroundColor Cyan
    }
}
