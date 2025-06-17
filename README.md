# 🏰 Maze Conquest

### 🌐 Play the Game

👉 **[Play Maze Conquest](https://imakeyouhappy.site)**

### 📚 Documentation

👉 [English Documentation](#english-documentation)
👉 [日本語のドキュメント](#日本語)

---

## <span id="english-documentation">📖 English Documentation</span>

### 🔖 Table of Contents

- [Description](#description)
- [How to Play](#how-to-play)
- [Technologies Used](#technologies-used)
- [Local Installation](#local-installation)
- [About This Project](#about-this-project)

---

## <span id="description">📋 Description</span>

**Maze Conquest** is an RPG adventure game featuring infinite dungeon depths. Level up your character to gain power and conquer endless mazes. The deeper you venture, the stronger your enemies become. Play anywhere and use your Google account to save your progress to the cloud!

---

## <span id="how-to-play">🎮 How to Play</span>

### 🎮 Controls

| Platform                | Controls                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Computer**            | `WASD`: Move/Navigate • `Enter`: Confirm • `Space`: Cancel/Open Menu                                          |
| **Mobile**              | Touch controls (buttons appear on first visit)                                                                |
| **Wireless Controller** | Use your smartphone as a wireless controller ([Setup Guide](https://github.com/AaronFabian/maze-conquest-sp)) |

### 🚀 Getting Started

1. **Launch the Game**
   Visit [https://imakeyouhappy.site](https://imakeyouhappy.site) and press `Enter` to begin.

   ![Start Screen](./media/startscreen.png)

2. **Choose Your Path**

   - **New Player**: Select `NEW GAME`
   - **Returning Player**: Select `LOAD GAME` to continue your adventure

   ![Select Screen](./media/selectscreen.png)

3. **Account Options** (for new games)

   - `REGISTER WITH GOOGLE`: Save progress to the cloud (recommended)
   - `PLAY WITHOUT SIGN IN`: Play locally without saving

   ![New Game Screen](./media/newgamescreen.png)

4. **Beginning Town**
   Start your journey in the Beginning Town. The character with the **red spotlight** handles cloud saves. Enter the portal door at the bottom to access the Maze.

   ![Beginning Town](./media/beginningtown.png)

5. **The Maze**
   **Prepare for battle!** Navigate through procedurally generated mazes where:

   - **Green spotlight**: Enemies (respawn randomly)
   - **Blue spotlight**: New areas to explore
   - **Doors**: Lead to deeper maze levels (fixed locations once spawned)

   ![Maze](./media/maze.png)

6. **Combat System**
   When you encounter enemies, choose your action:

   - **ATTACK**: Deal damage based on your character level
   - **DEFENSE**: Reduce incoming damage ⚠️ _Under development_
   - **ITEMS**: Access inventory for healing items
   - **RUN**: Escape from battle

   ![Battle Screen](./media/battlescreen.png)

7. **Menu System**
   Press `Space` anywhere to open the menu, then `Enter` to confirm selections:

   - **CONTINUE**: Return to game
   - **PARTY**: View character stats (HP, Level, etc.)
   - **HEROES**: Switch between characters ⚠️ _Under development_
   - **OPTIONS**: Game settings ⚠️ _Under development_
   - **INVENTORY**: Manage items (potions, phoenix feathers, etc.)
   - **EXIT**: Return to title screen (save progress first!)

   ![Menu Panel](./media/menupanel.png)

### 💡 Pro Tip

Use **Phoenix Feathers** to instantly escape from dungeons!

---

## <span id="technologies-used">⚙️ Technologies Used</span>

### Frontend 🎨

- **JavaScript/TypeScript**: 100% TypeScript with OOP design patterns for scalability
- **Canvas API**: Rendering and game graphics
- **Tween.js**: Smooth animations and transitions
- **Webpack**: Code compilation and legacy browser compatibility
- **Node.js**: Development dependencies

### Backend 🔧

- **Go**: Server-side logic
- **Go Fiber**: Web framework
- **Firebase Client SDK**: Cloud integration

### Infrastructure ☁️

- **Google Cloud Run**: Serverless deployment
- **Firebase Firestore**: Player data storage
- **Google Cloud Storage**: Game assets and images
- **Docker**: Containerized deployment
- **GitHub Actions**: Automated CI/CD pipeline

---

## <span id="local-installation">🛠️ Local Installation</span>

> ⚠️ **Warning**: Local installation may not work for everyone due to backend verification and environment variable requirements.

### Prerequisites

- [Git](https://git-scm.com/downloads) installed on your system
- Node.js and npm

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/AaronFabian/maze-conquest.git
   ```

2. **Navigate to project directory**

   ```bash
   cd maze-conquest
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

---

## <span id="about-this-project">👨‍💻 About This Project</span>

This is my first full-stack development project, combining all the knowledge I've acquired into a single application. As an RPG enthusiast, I wanted to create something that captures the essence of classic dungeon-crawling adventures.

**Future Goals**: My next target is to develop a multiplayer online game experience.

Thank you for playing, and I wish you the best of luck in your adventures!

_— Aaron Fabian_ 😊

---

## <span id="日本語">🇯🇵 日本語のドキュメント</span>

_[Japanese documentation would go here]_
