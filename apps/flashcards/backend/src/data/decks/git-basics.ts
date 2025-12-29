import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const gitBasics: SeedDeck = createDeck(
  "a1b2c3d4-1111-4000-8000-000000000011",
  "Git Version Control Basics",
  "Learn Git version control essentials. Covers repositories, commits, branches, merging, remote operations, undoing changes, stashing, and common workflows for collaborative development.",
  ["programming", "it", "certification"],
  [
  // Fundamentals
  mcCard(
    "What is Git?",
    ["A distributed version control system", "A programming language", "A code editor"],
    0,
    { explanation: "Git is a distributed version control system for tracking changes in source code.", researchUrl: "https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F" }
  ),
  mcCard(
    "What command creates a new Git repository?",
    ["git init", "git new", "git create"],
    0,
    { explanation: "git init initializes a new repository in the current directory.", researchUrl: "https://git-scm.com/docs/git-init" }
  ),
  mcCard(
    "What command downloads a copy of a remote repository?",
    ["git clone <url>", "git download <url>", "git copy <url>"],
    0,
    { explanation: "git clone creates a local copy of a remote repository.", researchUrl: "https://git-scm.com/docs/git-clone" }
  ),
  mcCard(
    "What are the three areas in Git?",
    ["Working directory, Staging area, Repository", "Local, Remote, Cloud", "Source, Compiled, Deployed"],
    0,
    { explanation: "Git uses the working directory (your files), staging area (index), and repository (committed history).", researchUrl: "https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F#_the_three_states" }
  ),

  // Basic Commands
  mcCard(
    "What command shows the current status of your repository?",
    ["git status", "git log", "git show"],
    0,
    { explanation: "git status shows modified, staged, and untracked files.", researchUrl: "https://git-scm.com/docs/git-status" }
  ),
  mcCard(
    "What command stages changes for the next commit?",
    ["git add", "git stage", "git commit"],
    0,
    { explanation: "git add moves changes to the staging area.", researchUrl: "https://git-scm.com/docs/git-add" }
  ),
  mcCard(
    "What does git add . do?",
    ["Stages all changes in current directory", "Creates a new repository", "Commits all changes"],
    0,
    { explanation: "git add . stages all changes in the current directory and subdirectories.", researchUrl: "https://git-scm.com/docs/git-add" }
  ),
  mcCard(
    "What command saves staged changes to the repository?",
    ["git commit", "git save", "git push"],
    0,
    { explanation: "git commit saves staged changes with a message.", researchUrl: "https://git-scm.com/docs/git-commit" }
  ),
  mcCard(
    "What is a good commit message format?",
    ["Short summary, blank line, detailed description", "Just the file names changed", "Date and time only"],
    0,
    { explanation: "A good commit message has a short summary (50 chars), blank line, then detailed description if needed.", researchUrl: "https://cbea.ms/git-commit/" }
  ),
  mcCard(
    "What command shows the commit history?",
    ["git log", "git history", "git status"],
    0,
    { explanation: "git log shows the commit history.", researchUrl: "https://git-scm.com/docs/git-log" }
  ),
  mcCard(
    "What does git log --oneline do?",
    ["Shows compact one-line-per-commit view", "Shows only the first commit", "Shows log output in XML"],
    0,
    { explanation: "git log --oneline shows compact one-line-per-commit view of history.", researchUrl: "https://git-scm.com/docs/git-log#_commit_formatting" }
  ),

  // Branches
  mcCard(
    "What is a branch?",
    ["An independent line of development", "A type of commit message", "A remote server"],
    0,
    { explanation: "A branch is an independent line of development - like a pointer to a specific commit.", researchUrl: "https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell" }
  ),
  mcCard(
    "What command lists all branches?",
    ["git branch", "git branches", "git list"],
    0,
    { explanation: "git branch lists branches; the current one has an asterisk.", researchUrl: "https://git-scm.com/docs/git-branch" }
  ),
  mcCard(
    "What command creates a new branch?",
    ["git branch <name>", "git new <name>", "git create <name>"],
    0,
    { explanation: "git branch <name> creates a new branch at the current commit.", researchUrl: "https://git-scm.com/docs/git-branch" }
  ),
  mcCard(
    "What command switches to a different branch?",
    ["git checkout <branch> or git switch <branch>", "git change <branch>", "git goto <branch>"],
    0,
    { explanation: "git checkout or git switch changes to another branch.", researchUrl: "https://git-scm.com/docs/git-switch" }
  ),
  mcCard(
    "What command creates AND switches to a new branch?",
    ["git checkout -b <name>", "git branch -new <name>", "git switch <name>"],
    0,
    { explanation: "The -b flag creates the branch and checks it out in one command.", researchUrl: "https://git-scm.com/docs/git-checkout#Documentation/git-checkout.txt--b" }
  ),
  mcCard(
    "What command deletes a branch?",
    ["git branch -d <name>", "git delete <name>", "git remove <name>"],
    0,
    { explanation: "git branch -d deletes a branch (-D for force delete).", researchUrl: "https://git-scm.com/docs/git-branch#Documentation/git-branch.txt--d" }
  ),

  // Merging
  mcCard(
    "What is a merge?",
    ["Combining changes from one branch into another", "Deleting a branch", "Creating a new repository"],
    0,
    { explanation: "A merge combines changes from one branch into another.", researchUrl: "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging" }
  ),
  mcCard(
    "What command merges a branch into your current branch?",
    ["git merge <branch>", "git combine <branch>", "git join <branch>"],
    0,
    { explanation: "git merge brings another branch's changes into your current branch.", researchUrl: "https://git-scm.com/docs/git-merge" }
  ),
  mcCard(
    "What is a merge conflict?",
    ["Same lines changed differently in both branches", "When a branch is deleted", "When Git runs out of memory"],
    0,
    { explanation: "A merge conflict occurs when Git can't automatically merge because the same lines were changed differently.", researchUrl: "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts" }
  ),
  mcCard(
    "How do you resolve a merge conflict?",
    ["Edit conflicting files, git add, git commit", "Delete the branch", "Run git reset --hard"],
    0,
    { explanation: "Edit the conflicting files (look for <<<<<<<, =======, >>>>>>>), then git add and git commit.", researchUrl: "https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging" }
  ),
  mcCard(
    "What is a fast-forward merge?",
    ["Git moves the pointer forward without a merge commit", "A merge that happens quickly", "A merge without conflicts"],
    0,
    { explanation: "When the target branch hasn't diverged, Git just moves the pointer forward without creating a merge commit.", researchUrl: "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merging" }
  ),

  // Remote Repositories
  mcCard(
    "What is a remote?",
    ["A repository hosted on the internet", "A local backup", "A branch on your machine"],
    0,
    { explanation: "A remote is a version of your repository hosted on the internet or network (like GitHub).", researchUrl: "https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes" }
  ),
  mcCard(
    "What command shows your remotes?",
    ["git remote -v", "git remotes", "git origin"],
    0,
    { explanation: "git remote -v shows the fetch and push URLs for each remote.", researchUrl: "https://git-scm.com/docs/git-remote" }
  ),
  mcCard(
    "What command uploads commits to a remote?",
    ["git push", "git upload", "git send"],
    0,
    { explanation: "git push sends your commits to the remote repository.", researchUrl: "https://git-scm.com/docs/git-push" }
  ),
  mcCard(
    "What command downloads and integrates remote changes?",
    ["git pull", "git download", "git sync"],
    0,
    { explanation: "git pull fetches and merges remote changes.", researchUrl: "https://git-scm.com/docs/git-pull" }
  ),
  mcCard(
    "What does git fetch do?",
    ["Downloads changes but doesn't merge", "Deletes remote changes", "Pushes your changes"],
    0,
    { explanation: "git fetch downloads changes from remote but doesn't merge them - lets you review first.", researchUrl: "https://git-scm.com/docs/git-fetch" }
  ),
  mcCard(
    "What is the difference between fetch and pull?",
    ["fetch downloads, pull downloads and merges", "They are the same", "fetch merges, pull downloads"],
    0,
    { explanation: "fetch downloads without merging; pull = fetch + merge.", researchUrl: "https://git-scm.com/book/en/v2/Git-Branching-Remote-Branches#_pulling" }
  ),
  mcCard(
    "What is 'origin'?",
    ["Default name for remote repository", "The first commit", "The main branch"],
    0,
    { explanation: "'origin' is the default name for your remote repository (usually where you cloned from).", researchUrl: "https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes" }
  ),

  // Undoing Changes
  mcCard(
    "How do you unstage a file?",
    ["git restore --staged <file>", "git delete <file>", "git undo <file>"],
    0,
    { explanation: "git restore --staged <file> or git reset HEAD <file> unstages a file.", researchUrl: "https://git-scm.com/docs/git-restore" }
  ),
  mcCard(
    "How do you discard changes in a file?",
    ["git restore <file>", "git delete <file>", "git remove <file>"],
    0,
    { explanation: "git restore <file> or git checkout -- <file> discards changes (careful - loses changes).", researchUrl: "https://git-scm.com/docs/git-restore" }
  ),
  mcCard(
    "What does git reset do?",
    ["Moves branch pointer back", "Deletes a branch", "Creates a new branch"],
    0,
    { explanation: "git reset moves branch pointer back. --soft keeps staging, --mixed unstages, --hard discards changes.", researchUrl: "https://git-scm.com/docs/git-reset" }
  ),
  mcCard(
    "What command reverts a commit by creating a new commit?",
    ["git revert <commit>", "git undo <commit>", "git rollback <commit>"],
    0,
    { explanation: "git revert creates a new commit that undoes the specified commit.", researchUrl: "https://git-scm.com/docs/git-revert" }
  ),
  mcCard(
    "When should you use reset vs revert?",
    ["revert for public history, reset for local", "reset for public, revert for local", "They are interchangeable"],
    0,
    { explanation: "Use revert for public/shared history; reset for local-only commits.", researchUrl: "https://www.atlassian.com/git/tutorials/resetting-checking-out-and-reverting" }
  ),

  // Stashing
  mcCard(
    "What does git stash do?",
    ["Temporarily saves uncommitted changes", "Deletes uncommitted changes", "Commits changes immediately"],
    0,
    { explanation: "git stash temporarily saves your uncommitted changes so you can work on something else.", researchUrl: "https://git-scm.com/docs/git-stash" }
  ),
  mcCard(
    "What command applies stashed changes?",
    ["git stash pop", "git stash apply", "Both work"],
    2,
    { explanation: "pop applies and removes from stash; apply keeps the stash.", researchUrl: "https://git-scm.com/docs/git-stash#Documentation/git-stash.txt-pop--teleportindex-teleportstashstash" }
  ),
  mcCard(
    "How do you list stashes?",
    ["git stash list", "git stash show", "git stash all"],
    0,
    { explanation: "git stash list shows all stashed changes.", researchUrl: "https://git-scm.com/docs/git-stash#Documentation/git-stash.txt-list" }
  ),

  // Configuration
  mcCard(
    "How do you set your name and email in Git?",
    ["git config --global user.name and user.email", "git set name and email", "git profile --name"],
    0,
    { explanation: "git config --global user.name 'Name' and git config --global user.email 'email' sets your identity.", researchUrl: "https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup" }
  ),
  mcCard(
    "What is .gitignore?",
    ["A file listing patterns Git should ignore", "A secret configuration file", "A backup of ignored files"],
    0,
    { explanation: ".gitignore is a file listing patterns for files Git should ignore (like node_modules, .env).", researchUrl: "https://git-scm.com/docs/gitignore" }
  ),
  mcCard(
    "What does --global mean in git config?",
    ["Setting applies to all repos for this user", "Setting only applies to this repo", "Setting applies to all users"],
    0,
    { explanation: "The --global flag means the setting applies to all repositories for this user.", researchUrl: "https://git-scm.com/docs/git-config#Documentation/git-config.txt---global" }
  ),

  // Viewing Changes
  mcCard(
    "What command shows unstaged changes?",
    ["git diff", "git changes", "git show"],
    0,
    { explanation: "git diff shows differences between working directory and staging area.", researchUrl: "https://git-scm.com/docs/git-diff" }
  ),
  mcCard(
    "What does git diff --staged show?",
    ["Differences between staging and last commit", "Differences between branches", "All uncommitted changes"],
    0,
    { explanation: "git diff --staged shows differences between staging area and last commit.", researchUrl: "https://git-scm.com/docs/git-diff#Documentation/git-diff.txt---staged" }
  ),
  mcCard(
    "What does git show <commit> do?",
    ["Displays info about a specific commit", "Shows all commits", "Lists all branches"],
    0,
    { explanation: "git show <commit> displays information about a specific commit including its changes.", researchUrl: "https://git-scm.com/docs/git-show" }
  ),

  // Best Practices
  mcCard(
    "How often should you commit?",
    ["Small, logical changes often", "Once per day at most", "Only when feature is complete"],
    0,
    { explanation: "Commit small, logical changes often. Each commit should be one 'unit' of work.", researchUrl: "https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project" }
  ),
  mcCard(
    "What is a feature branch?",
    ["A branch for developing a specific feature", "The main production branch", "A branch for bug fixes only"],
    0,
    { explanation: "A feature branch is created for developing a specific feature, then merged back to main.", researchUrl: "https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow" }
  ),
  mcCard(
    "What is a pull request?",
    ["A request to merge your branch with code review", "A request to download code", "A request to delete a branch"],
    0,
    { explanation: "A pull request is a request to merge your branch into another branch, often with code review.", researchUrl: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests" }
  ),
  mcCard(
    "What is .git folder?",
    ["Hidden folder containing all Git data", "A backup folder", "A folder for ignored files"],
    0,
    { explanation: ".git is a hidden folder containing all Git data for the repository. Don't modify directly.", researchUrl: "https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain" }
  ),

  // Common Workflows
  mcCard(
    "What is the basic Git workflow?",
    ["pull, make changes, add, commit, push", "clone, edit, push", "init, commit, merge"],
    0,
    { explanation: "1) git pull, 2) make changes, 3) git add, 4) git commit, 5) git push.", researchUrl: "https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository" }
  ),
  mcCard(
    "What is the feature branch workflow?",
    ["Create branch, commit, push, PR, review, merge", "Work on main, push when done", "Clone, edit, force push"],
    0,
    { explanation: "1) Create feature branch, 2) make commits, 3) push branch, 4) create PR, 5) review and merge.", researchUrl: "https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow" }
  ),
]);
