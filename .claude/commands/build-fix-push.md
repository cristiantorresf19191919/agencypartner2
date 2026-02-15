Run `npm run build` and iteratively fix all build errors, committing each fix granularly, then push.

Follow this exact process:

1. **Run the build**: Execute `npm run build` and capture the output.

2. **If the build succeeds** with no errors: Report success and stop. Do NOT push if there were no changes.

3. **If the build fails**, analyze the errors and fix them one logical group at a time:
   - Fix ONE issue (or a tightly related group of issues in the same file/component).
   - Stage ONLY the files changed for that specific fix.
   - Commit with a conventional commit message. Use the appropriate prefix:
     - `fix:` for bug fixes and build error corrections
     - `feat:` for new functionality
     - `refactor:` for code restructuring without behavior change
     - `style:` for formatting/whitespace/CSS changes
     - `chore:` for tooling, config, dependency changes
   - The commit message must be concise and descriptive. Example: `fix: resolve missing import in Header component`
   - Do NOT include any "Co-Authored-By" line or any Claude/AI references in the commit message.
   - Use this commit format:
     ```
     git commit -m "prefix: descriptive message"
     ```

4. **Re-run the build** after each fix to check if more errors remain. Repeat step 3 until the build passes.

5. **Once the build passes cleanly**, push all commits to the remote:
   ```
   git push
   ```

6. **Report a summary** of all commits made and confirm the push succeeded.

Important rules:
- NEVER use `--no-verify` flags.
- NEVER amend existing commits.
- NEVER include "Co-Authored-By" or any AI/Claude attribution in commits.
- Each commit should be atomic — one logical fix per commit.
- If a fix touches multiple files for the same issue, that's fine as one commit.
- If you encounter an error you cannot fix, stop and report it to the user instead of guessing.
