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

This is my first full-stack development project, combining all the knowledge I've acquired into a single application. As an RPG enthusiast, I wanted to create something that captures the essence of classic 85' RPG adventures.

**Future Goals**: My next target is to develop a multiplayer online game experience.

Thank you for playing, and I wish you all the best !

_— Aaron Fabian_ 😊

---

## <span id="日本語">🇯🇵 日本語のドキュメント</span>

### 🔖 目次

- [ゲーム説明](#ゲーム説明)
- [遊び方](#遊び方)
- [使用技術](#使用技術)
- [ローカルインストール](#ローカルインストール)
- [プロジェクトについて](#プロジェクトについて)

---

## <span id="ゲーム説明">📋 ゲーム説明</span>

**Maze Conquest**は、無限の深さを持つダンジョンが特徴の RPG アドベンチャーゲームです。キャラクターをレベルアップさせてパワーを得て、終わりのない迷宮を征服しましょう。深く進むほど、敵はより強くなります。どこでもプレイでき、Google アカウントを使用して進行状況をクラウドに保存できます！

---

## <span id="遊び方">🎮 遊び方</span>

### 🎮 操作方法

| プラットフォーム             | 操作                                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **パソコン**                 | `WASD`: 移動/選択 • `Enter`: 決定 • `Space`: キャンセル/メニューを開く                                              |
| **スマートフォン**           | タッチ操作（初回アクセス時にボタンが表示されます）                                                                  |
| **ワイヤレスコントローラー** | スマートフォンをワイヤレスコントローラーとして使用（[設定ガイド](https://github.com/AaronFabian/maze-conquest-sp)） |

### 🚀 ゲームの始め方

1. **ゲーム起動**
   [https://imakeyouhappy.site](https://imakeyouhappy.site)にアクセスし、`Enter`キーを押してゲームを開始します。

   ![スタート画面](./media/startscreen.png)

2. **モード選択**

   - **新規プレイヤー**: `NEW GAME`を選択
   - **継続プレイヤー**: `LOAD GAME`を選択して冒険を続行

   ![選択画面](./media/selectscreen.png)

3. **アカウント設定**（新規ゲームの場合）

   - `REGISTER WITH GOOGLE`: 進行状況をクラウドに保存（推奨）
   - `PLAY WITHOUT SIGN IN`: 保存なしでローカルプレイ

   ![新規ゲーム画面](./media/newgamescreen.png)

4. **始まりの町**
   始まりの町から冒険をスタートします。**赤いスポットライト**のキャラクターがクラウドセーブを管理します。下部のポータルドアから迷宮にアクセスできます。

   ![始まりの町](./media/beginningtown.png)

5. **迷宮**
   **戦闘の準備をしよう！** 自動生成される迷宮を探索します：

   - **緑のスポットライト**: 敵（ランダムにリスポーン）
   - **青のスポットライト**: 探索可能な新エリア
   - **扉**: より深い迷宮レベルへ（一度出現すると位置固定）

   ![迷宮](./media/maze.png)

6. **戦闘システム**
   敵と遭遇した際の行動選択：

   - **ATTACK**: キャラクターレベルに応じたダメージを与える
   - **DEFENSE**: 受けるダメージを軽減 ⚠️ _開発中_
   - **ITEMS**: インベントリにアクセスして回復アイテムを使用
   - **RUN**: 戦闘から逃走

   ![戦闘画面](./media/battlescreen.png)

7. **メニューシステム**
   どこでも`Space`キーでメニューを開き、`Enter`で選択確定：

   - **CONTINUE**: ゲームに戻る
   - **PARTY**: キャラクターステータス確認（HP、レベルなど）
   - **HEROES**: キャラクター切り替え ⚠️ _開発中_
   - **INVENTORY**: アイテム管理（ポーション、フェニックスの羽など）
   - **EXIT**: タイトル画面に戻る（事前に進行状況を保存してください！）

   ![メニューパネル](./media/menupanel.png)

### 💡 プロのコツ

**フェニックスの羽**を使用してダンジョンから瞬時に脱出できます！

---

## <span id="使用技術">⚙️ 使用技術</span>

### フロントエンド 🎨

- **JavaScript/TypeScript**: スケーラビリティのための OOP 設計パターンで 100%TypeScript
- **Canvas API**: レンダリングとゲームグラフィックス
- **Tween.js**: スムーズなアニメーションとトランジション
- **Webpack**: コードコンパイルとレガシーブラウザ互換性
- **Node.js**: 開発依存関係

### バックエンド 🔧

- **Go**: サーバーサイドロジック
- **Go Fiber**: Web フレームワーク
- **Firebase Client SDK**: クラウド統合

### インフラストラクチャ ☁️

- **Google Cloud Run**: サーバーレスデプロイメント
- **Firebase Firestore**: プレイヤーデータストレージ
- **Google Cloud Storage**: ゲームアセットと画像
- **Docker**: コンテナ化デプロイメント
- **GitHub Actions**: 自動 CI/CD パイプライン

---

## <span id="ローカルインストール">🛠️ ローカルインストール</span>

> ⚠️ **警告**: バックエンドの認証や環境変数の要件により、ローカルインストールがすべての人で動作するとは限りません。

### 前提条件

- システムに[Git](https://git-scm.com/downloads)がインストールされていること
- Node.js と npm

### インストール手順

1. **リポジトリをクローン**

   ```bash
   git clone https://github.com/AaronFabian/maze-conquest.git
   ```

2. **プロジェクトディレクトリに移動**

   ```bash
   cd maze-conquest
   ```

3. **依存関係をインストール**

   ```bash
   npm install
   ```

4. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

---

## <span id="プロジェクトについて">👨‍💻 プロジェクトについて</span>

これは私初のフルスタック開発プロジェクトで、これまでに習得した知識をすべて一つのアプリケーションに結集したものです。RPG が大好きなので、クラシックなダンジョン探索アドベンチャーの本質を捉えるものを作りたいと思いました。

**将来の目標**: 次の目標は、マルチプレイヤーオンラインゲーム体験の開発です。

プレイしていただき、ありがとうございます。皆様のプロジェクトの成功をお祈りします！

_— Aaron Fabian_ 😊
