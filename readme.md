# LeetCloak 🛡️

A lightweight, zero-flicker browser extension for **Brave**, **Google Chrome**, and other Chromium browsers that hides difficulty badges ("Easy", "Medium", "Hard") and "Solved" indicators across LeetCode to eliminate bias during interview preparation.

🔗 **Repository**: [github.com/surajgoraicse/LeetCloak](https://github.com/surajgoraicse/LeetCloak)

---

## ⚡ What It Does

- **Hides Difficulty Badges**:
  - **Problem Set Table** (`/problemset/`): Hides difficulty while preserving column spacing so acceptance rates and locks stay aligned.
  - **Problem Solving Page** (`/problems/<slug>/`): Collapses difficulty badge so "Topics" and "Companies" buttons shift seamlessly.
  - **Similar Questions**: Hides difficulty tags on related questions.
- **Hides Solved Indicators**:
  - Hides the "Solved" banner next to the question title.
  - Hides status checkmarks (✓) on problemset rows.
- **Zero-Flicker**: Injected at `document_start` so indicators never flash on page load.
- **Editor Safe**: Never affects code editor blocks, syntax highlighting, or discussion comments.

---

## 🛠️ Setup

1. **Clone the repository**:
   ```bash
   git clone git@github.com:surajgoraicse/LeetCloak.git
   ```

2. **Load into Browser (Brave / Chrome)**:
   - Navigate to:
     - **Brave**: `brave://extensions`
     - **Chrome**: `chrome://extensions`
   - Enable **Developer mode** (toggle in the top-right corner).
   - Click **Load unpacked** (top-left).
   - Select the cloned `LeetCloak` folder.

---

## 🚀 How to Use

1. Open [leetcode.com/problemset/](https://leetcode.com/problemset/) or any problem page.
2. Badges and solved icons are automatically hidden.
3. Click the **LeetCloak** icon in the browser toolbar to customize settings with live preview.

---

## ⚙️ Settings

Customize your experience directly from the extension popup:

| Setting | Options | Description |
| :--- | :--- | :--- |
| **Master Switch** | `ON` / `OFF` | Enable or disable the entire extension |
| **Difficulty Mode** | `Hidden` | Completely removes difficulty badges (default) |
| | `Reveal on Hover` | Blurs badges, unblurring when mouse hovers over them |
| | `Placeholder` | Replaces badges with a clean `—` marker |
| **Problem Set Difficulty** | Toggle | Show/hide difficulty column on `/problemset/` |
| **Problem Solving Difficulty** | Toggle | Show/hide badge next to problem title |
| **Similar Questions** | Toggle | Show/hide difficulty in related questions |
| **Solved Status & Checkmarks** | Toggle | Show/hide "Solved" banners & checkmark icons |

---

## 🔄 Updating / Reloading

After pulling changes or editing files:
1. Go to `brave://extensions` or `chrome://extensions`.
2. Click the **Reload icon (🔄)** on the **LeetCloak** card.
3. Hard refresh your open LeetCode tabs (`Ctrl + Shift + R`).

---

## 📄 License

MIT
