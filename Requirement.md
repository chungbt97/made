# Requirement - Score Tracking Web App

## 1. Objective
Build a web app for score tracking in billiards or board games using a zero-sum scoring model:
- One player gains points when they win.
- The total positive points gained by the winner must equal the total negative points lost by the other players.
- The total score of all players must always remain `0` at any time.

## 2. Scoring Rules
- Each player has a current score, which can be negative, positive, or `0`.
- When one player's score changes, the system must ensure that the total score of all players still equals `0`.
- If one player receives `+X` points, the other players must collectively lose `-X` points.
- If one player loses `-X` points, the other players must collectively gain `+X` points.
- The app should make it easy to identify who is leading and who is currently behind.

## 3. UI Overview
The interface consists of 2 main sections:

### 3.1. Summary Board at the Top
- Display an overview of all player scores similar to `board.png`.
- Suggested presentation: a bar chart combined with a line chart.
- The horizontal axis shows player names.
- The vertical axis shows current scores.
- Positive and negative scores should be clearly differentiated by color.
- There must be a visible `0` baseline so users can quickly see who is above or below zero.
- The board must update immediately whenever any player's score changes.
- The board should make it easy to see the current leader, the lowest-scoring player, and the score differences between players.

### 3.2. Player List at the Bottom
This section should follow the layout shown in `ui.png`:
- Each player is displayed in a separate card.
- Each card includes:
	- Avatar or player icon.
	- Player name.
	- Current score displayed prominently in a large size.
	- A decrease button on the left.
	- An increase button on the right.
- Each player's card may use a distinct background color for easier recognition.
- The display order may be based on score ranking or on player creation order.

## 4. Core Features

### 4.1. Add Player
- Users can add a new player to the game.
- Minimum required information:
	- Player name.
- Optional information:
	- Avatar.
	- Card color.
- After being added, a new player starts with a default score of `0`.
- Both the player list and the summary board must update immediately.

### 4.2. Change One Player's Score
- Users can increase or decrease a player's score using the `+` and `-` buttons.
- The score step per action should be configurable, for example: `1`, `10`, `100`.
- When one player's score changes, the system must automatically distribute the corresponding offset across the other players so that the total remains `0`.
- The updated values must be shown immediately on both the player card and the summary board.
- The system must prevent updates that violate the zero-sum scoring rule.

### 4.3. View Total Scores on the Board
- Users can view the current overall score distribution for all players in the top summary board.
- The board should clearly show:
	- Each player's score value.
	- The current leader.
	- The player with the lowest score.
	- The `0` baseline for quick comparison.

## 5. System Behavior
- Every score change must update both areas in sync:
	- The player's score card.
	- The summary board.
- The system must never allow the total score across all players to become anything other than `0`.
- The UI should support fast interaction during an active real-world game session.
- The app should be responsive and work well on mobile and tablet devices.

## 6. Basic Tech Stack
The first implementation should use a simple and maintainable stack based on Next.js:
- Framework: Next.js.
- Language: TypeScript.
- UI: React with basic CSS Modules or Tailwind CSS.
- Charting: a lightweight chart library such as Recharts for the top score board.
- State management: React local state plus a small app-level context if needed.
- Data storage: IndexedDB for persistent local session storage.
- PWA support: service worker and web app manifest.

## 7. PWA Requirements
- The app should be installable as a Progressive Web App on mobile and desktop.
- The app should include a valid `manifest.json` with app name, icon, theme color, and display mode.
- The app should support offline access for the core score tracking flow.
- Static assets and the app shell should be cached so the UI can load even without an internet connection.
- Users should be able to open the app from the home screen like a native app.

## 8. Local Storage and Multi-Session Support
- Game data should be stored locally in IndexedDB.
- The app should support multiple game sessions, not just one active score board.
- A user can create a new session for a new match.
- A user can reopen an existing session and continue updating scores.
- Each session should store at least:
	- Session id.
	- Session name.
	- Created date.
	- Updated date.
	- List of players.
	- Current scores.
	- Score change step configuration.
- The app should preserve data after browser refresh, tab close, or device restart.
- The app should work fully offline for viewing and updating saved sessions.

## 9. Suggested Basic Data Model
- `Session`
	- `id`
	- `name`
	- `createdAt`
	- `updatedAt`
	- `scoreStep`
	- `players`
- `Player`
	- `id`
	- `name`
	- `avatar`
	- `color`
	- `score`

## 10. Initial Scope
The first version should focus on:
- Adding players.
- Increasing or decreasing one player's score.
- Displaying the summary score board at the top.
- Creating and saving multiple sessions in IndexedDB.
- Reopening a saved session and continuing the game offline.
- Enforcing the rule that the total score always equals `0`.

## 11. Completion Criteria
- Users can create a game with multiple players.
- Users can quickly adjust each player's score.
- The top board accurately reflects the current scores of all players.
- Users can create, save, and reopen multiple sessions locally.
- The app can still be used when offline after the first load.
- The total score across all players always remains `0` after every action.

## 12. Implementation Checklist

### 12.1. Project Setup
- [ ] Initialize a Next.js project with TypeScript.
- [ ] Enable App Router.
- [ ] Configure basic styling with CSS Modules or Tailwind CSS.
- [ ] Add a chart library for the score board.
- [ ] Set up a clean folder structure for components, hooks, lib, and types.

### 12.2. PWA Setup
- [ ] Add a web app manifest.
- [ ] Add app icons for installable PWA support.
- [ ] Configure service worker support.
- [ ] Cache the app shell and essential static assets.
- [ ] Verify the app can open offline after the first successful load.

### 12.3. Data Model and Local Storage
- [ ] Define TypeScript types for `Session` and `Player`.
- [ ] Create an IndexedDB layer for reading and writing sessions.
- [ ] Add create, update, delete, and get-by-id methods for sessions.
- [ ] Persist score changes automatically to IndexedDB.
- [ ] Restore the last opened or selected session on app reload.

### 12.4. Session Management
- [ ] Create a screen or panel to list all saved sessions.
- [ ] Allow users to create a new session.
- [ ] Allow users to rename a session.
- [ ] Allow users to reopen an existing session.
- [ ] Allow users to delete a session.

### 12.5. Player Management
- [ ] Add a form or modal to create a new player.
- [ ] Validate that player name is required.
- [ ] Support optional avatar and card color.
- [ ] Initialize each new player with score `0`.
- [ ] Update the board and player list immediately after adding a player.

### 12.6. Score Update Logic
- [ ] Add `+` and `-` controls on each player card.
- [ ] Support configurable score step values such as `1`, `10`, and `100`.
- [ ] Implement zero-sum score distribution logic.
- [ ] Prevent any update that would break the total score rule.
- [ ] Re-render the player cards and board immediately after each score change.

### 12.7. Summary Board
- [ ] Build the top score board using a bar or mixed chart.
- [ ] Display player names on the horizontal axis.
- [ ] Display score values on the vertical axis.
- [ ] Highlight positive and negative values with different colors.
- [ ] Show a clear `0` baseline.
- [ ] Make the board reactive to all score updates.

### 12.8. Main Gameplay Screen
- [ ] Build the player card list based on the UI reference.
- [ ] Show avatar, player name, and large score value on each card.
- [ ] Place decrease and increase actions on the left and right sides.
- [ ] Make the layout work well on mobile first.
- [ ] Ensure the game screen remains fast and easy to use during play.

### 12.9. State Management
- [ ] Add app-level state for the active session.
- [ ] Keep in-memory state synchronized with IndexedDB.
- [ ] Handle empty state when no session exists.
- [ ] Handle empty state when a session has no players.

### 12.10. Validation and Edge Cases
- [ ] Prevent duplicate accidental session creation caused by repeated taps.
- [ ] Handle sessions with only one player.
- [ ] Handle players with long names.
- [ ] Handle large positive and negative score values.
- [ ] Verify score totals always remain `0` after every action.

### 12.11. Testing and Verification
- [ ] Verify adding a player updates both the list and the board.
- [ ] Verify score changes persist after refresh.
- [ ] Verify multiple sessions can be created and reopened correctly.
- [ ] Verify offline usage works after the first load.
- [ ] Verify installability on supported mobile and desktop browsers.

## 13. Suggested Folder Structure
Recommended basic structure for a Next.js App Router project:

```text
src/
	app/
		layout.tsx
		page.tsx
		sessions/
			page.tsx
		session/
			[sessionId]/
				page.tsx
		manifest.ts
	components/
		board/
			score-board.tsx
			score-board.module.css
		player/
			player-card.tsx
			player-list.tsx
			player-form.tsx
		session/
			session-list.tsx
			session-item.tsx
			session-form.tsx
		ui/
			button.tsx
			input.tsx
			modal.tsx
			empty-state.tsx
	hooks/
		use-active-session.ts
		use-indexeddb.ts
		use-score-actions.ts
	lib/
		db/
			indexeddb.ts
			session-repository.ts
		scoring/
			zero-sum.ts
		utils/
			format-score.ts
			dates.ts
	providers/
		app-provider.tsx
		session-provider.tsx
	styles/
		globals.css
	types/
		player.ts
		session.ts
public/
	icons/
	manifest.webmanifest
	sw.js
```

### 13.1. Folder Responsibilities
- `app/`: routes, page entry points, layout, and metadata.
- `components/`: reusable UI parts for board, players, sessions, and shared controls.
- `hooks/`: local behavior hooks for active session state, score actions, and browser storage integration.
- `lib/db/`: IndexedDB access and repository functions.
- `lib/scoring/`: zero-sum scoring rules and score calculation helpers.
- `providers/`: React context providers for app-level and session-level state.
- `types/`: TypeScript domain models.
- `public/`: icons, manifest, and service worker assets.

## 14. MVP Delivery Phases

### Phase 1. Core Local Gameplay MVP
Goal: make the app usable for one active local game.
- Set up Next.js with TypeScript and App Router.
- Build the main gameplay screen.
- Add player creation.
- Add player cards with score increase and decrease actions.
- Implement zero-sum score logic.
- Render the top summary board.
- Keep all state in memory only for this phase.

Exit criteria:
- A user can create a game locally in one browser tab.
- A user can add players and change scores.
- The total score always remains `0`.

### Phase 2. Persistent Multi-Session MVP
Goal: make the app practical for real repeated use.
- Add IndexedDB storage.
- Support session creation, session list, reopen session, rename session, and delete session.
- Persist all score updates and player changes.
- Restore the last active session on reload.

Exit criteria:
- A user can manage multiple sessions on one device.
- Data still exists after refresh or browser restart.
- Sessions can be resumed without losing scores.

### Phase 3. Offline-Ready PWA MVP
Goal: make the app installable and usable without network access.
- Add manifest and app icons.
- Add service worker.
- Cache the app shell and essential assets.
- Validate installability on supported browsers.
- Validate that saved sessions can still be opened and updated offline.

Exit criteria:
- The app can be installed to home screen or desktop.
- The main score tracking flow works offline after the first load.

### Phase 4. UX Hardening and Edge Cases
Goal: improve reliability and real-world usability.
- Add empty states for no sessions and no players.
- Handle long player names and large scores.
- Add score step presets such as `1`, `10`, and `100`.
- Improve mobile layout and tap targets.
- Add safeguards against duplicate actions.

Exit criteria:
- The app is stable for common real-world game usage.
- The mobile experience is fast and clear.

### Phase 5. Nice-to-Have Enhancements
Goal: extend usability after MVP is complete.
- Add session history or round history.
- Add export and import for sessions.
- Add player templates or reusable player presets.
- Add themes or custom board styles.

Exit criteria:
- Additional features improve convenience without changing the core gameplay model.