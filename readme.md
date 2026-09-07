# LeetCloak 🛡️

A lightweight, zero-flicker browser extension for **Brave**, **Google Chrome**, and Chromium browsers that hides difficulty badges ("Easy", "Medium", "Hard") and "Solved" status indicators across LeetCode, featuring a dedicated **Side Panel** workspace that automatically restricts itself exclusively to LeetCode pages.

🔗 **Repository**: [github.com/surajgoraicse/LeetCloak](https://github.com/surajgoraicse/LeetCloak)

---

## ⚡ What It Does

- **Hides Difficulty Badges**:
  - **Problem Set Table** (`/problemset/`): Hides difficulty while keeping fixed column spacing so acceptance rates, lock icons, and stars remain perfectly aligned.
  - **Problem Solving Page** (`/problems/<slug>/`): Collapses the difficulty pill so "Topics" and "Companies" buttons shift naturally.
  - **Similar Questions**: Hides difficulty tags in related questions.
- **Hides Solved Indicators**:
  - Hides the "Solved" banner next to the question title.
  - Hides status checkmarks (✓) on problemset rows.
- **LeetCode-Exclusive Side Panel**:
  - Automatically enables and opens only on LeetCode (`leetcode.com` / `leetcode.cn`).
  - Stays disabled and dimmed on non-LeetCode websites (e.g. Google, YouTube, GitHub), preventing clutter.
  - Switches or closes automatically when you navigate away from LeetCode.
- **Zero-Flicker**: Injected at `document_start` so indicators never flash during page loads.
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
3. Click the **LeetCloak** icon in the browser toolbar to open the **Side Panel** and adjust settings with live preview.
4. On any other website, the icon remains disabled and the side panel will not open.

---

## ⚙️ Settings

Customize your experience directly from the Side Panel:

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
