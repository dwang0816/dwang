# Setting Up Multiple GitHub Accounts

## Current Configuration
- **Account 1**: Dennis (dennis@splitroadmedia.com) - Global config
- **Account 2**: [To be configured]

## Method 1: SSH Keys with Different Hosts (Recommended)

This allows you to use different GitHub accounts for different repositories.

### Step 1: Generate SSH Keys for Each Account

```powershell
# For Account 1 (personal/work)
ssh-keygen -t ed25519 -C "dennis@splitroadmedia.com" -f ~/.ssh/id_ed25519_account1

# For Account 2 (other account)
ssh-keygen -t ed25519 -C "your-other-email@example.com" -f ~/.ssh/id_ed25519_account2
```

### Step 2: Add SSH Keys to SSH Agent

```powershell
# Start SSH agent
Start-Service ssh-agent

# Add keys
ssh-add ~/.ssh/id_ed25519_account1
ssh-add ~/.ssh/id_ed25519_account2
```

### Step 3: Create SSH Config File

Create/edit `~/.ssh/config`:

```
# Account 1 (default - dennis@splitroadmedia.com)
Host github.com-account1
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_account1

# Account 2 (other account)
Host github.com-account2
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_account2
```

### Step 4: Add Public Keys to GitHub

1. Copy public key: `Get-Content ~/.ssh/id_ed25519_account1.pub | Set-Clipboard`
2. Go to GitHub → Settings → SSH and GPG keys → New SSH key
3. Repeat for account 2

### Step 5: Use Different Hosts in Repositories

When cloning or setting remote URLs:

```powershell
# For Account 1 repositories
git remote set-url origin git@github.com-account1:username/repo.git

# For Account 2 repositories
git remote set-url origin git@github.com-account2:username/repo.git
```

## Method 2: Per-Repository Git Config

For this repository (dwang), set local config:

```powershell
cd "C:\Users\User\Desktop\Vibe Code Projects\dwang"
git config user.name "Account2Name"
git config user.email "account2@example.com"
```

This overrides global config for this repo only.

## Method 3: Git Credential Manager (Windows)

Windows Credential Manager can store multiple credentials:

```powershell
# Clear existing credentials
git credential-manager-core erase https://github.com

# Next time you push/pull, it will prompt for credentials
# You can store different credentials for different repos
```

## Quick Setup Script

Run this PowerShell script to set up SSH keys:

```powershell
# Generate keys
ssh-keygen -t ed25519 -C "dennis@splitroadmedia.com" -f ~/.ssh/id_ed25519_account1 -N '""'
ssh-keygen -t ed25519 -C "account2@example.com" -f ~/.ssh/id_ed25519_account2 -N '""'

# Create SSH config
@"
# Account 1
Host github.com-account1
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_account1

# Account 2
Host github.com-account2
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_account2
"@ | Out-File -FilePath ~/.ssh/config -Encoding utf8

# Display public keys to add to GitHub
Write-Host "`n=== Account 1 Public Key ===" -ForegroundColor Green
Get-Content ~/.ssh/id_ed25519_account1.pub
Write-Host "`n=== Account 2 Public Key ===" -ForegroundColor Green
Get-Content ~/.ssh/id_ed25519_account2.pub
```

