# Setup Multiple GitHub Accounts Script
# Run this script to set up SSH keys for multiple GitHub accounts

Write-Host "=== GitHub Multiple Accounts Setup ===" -ForegroundColor Cyan
Write-Host ""

# Get account details
$account1Email = Read-Host "Enter email for Account 1 (current: dennis@splitroadmedia.com)"
if ([string]::IsNullOrWhiteSpace($account1Email)) {
    $account1Email = "dennis@splitroadmedia.com"
}

$account2Email = Read-Host "Enter email for Account 2"
if ([string]::IsNullOrWhiteSpace($account2Email)) {
    Write-Host "Account 2 email is required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Generating SSH keys..." -ForegroundColor Yellow

# Generate SSH keys
ssh-keygen -t ed25519 -C $account1Email -f ~/.ssh/id_ed25519_account1 -N '""' -q
ssh-keygen -t ed25519 -C $account2Email -f ~/.ssh/id_ed25519_account2 -N '""' -q

Write-Host "SSH keys generated!" -ForegroundColor Green

# Create SSH config
Write-Host "Creating SSH config..." -ForegroundColor Yellow

$sshConfig = @"
# Account 1 - $account1Email
Host github.com-account1
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_account1

# Account 2 - $account2Email
Host github.com-account2
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_account2
"@

$sshConfig | Out-File -FilePath ~/.ssh/config -Encoding utf8 -NoNewline

Write-Host "SSH config created!" -ForegroundColor Green

# Add keys to SSH agent
Write-Host "Adding keys to SSH agent..." -ForegroundColor Yellow
Start-Service ssh-agent -ErrorAction SilentlyContinue
ssh-add ~/.ssh/id_ed25519_account1 2>$null
ssh-add ~/.ssh/id_ed25519_account2 2>$null

Write-Host ""
Write-Host "=== NEXT STEPS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Copy the public keys below and add them to GitHub:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Account 1 Public Key ($account1Email):" -ForegroundColor Green
Get-Content ~/.ssh/id_ed25519_account1.pub
Write-Host ""
Write-Host "Account 2 Public Key ($account2Email):" -ForegroundColor Green
Get-Content ~/.ssh/id_ed25519_account2.pub
Write-Host ""
Write-Host "2. Add keys to GitHub:" -ForegroundColor Yellow
Write-Host "   - Go to: https://github.com/settings/keys"
Write-Host "   - Click 'New SSH key'"
Write-Host "   - Paste the appropriate public key"
Write-Host ""
Write-Host "3. Update your repository remotes:" -ForegroundColor Yellow
Write-Host "   For Account 1 repos: git remote set-url origin git@github.com-account1:username/repo.git"
Write-Host "   For Account 2 repos: git remote set-url origin git@github.com-account2:username/repo.git"
Write-Host ""

# Copy first key to clipboard
Get-Content ~/.ssh/id_ed25519_account1.pub | Set-Clipboard
Write-Host "Account 1 public key copied to clipboard!" -ForegroundColor Green

