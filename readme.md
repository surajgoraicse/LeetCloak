# LeetCloak 🛡️

A lightweight, zero-flicker browser extension for **Brave** and **Google Chrome** that hides difficulty badges (Easy, Medium, Hard) and solved indicators across LeetCode to eliminate bias during coding practice.

Repository: `git@github.com:surajgoraicse/LeetCloak.git`

---

## ⚡ What It Does

- **Hides Difficulty Badges**:
  - Problem set table (`/problemset/`)
  - Problem solving page (`/problems/<slug>/`)
  - Similar questions list
- **Hides Solved Indicators**:
  - "Solved" banner on problem pages
  - Status checkmarks (✓) on problemset rows without disrupting column alignment
- **Zero-Flicker**: Injected at `document_start` so badges never flash while loading.
- **Editor Safe**: Never affects code editor blocks, syntax highlighting, or discussion comments.

---

## 🛠️ Setup

1. **Clone the repository**:
   ```bash
   git clone git@github.com:surajgoraicse/LeetCloak.git
   ```

2. **Load into Brave / Chrome**:
   - Open `brave://extensions` or `chrome://extensions`.
   - Enable **Developer mode** (top-right corner).
   - Click **Load unpacked** (top-left).
   - Select the cloned `LeetCloak` folder.

---

## 🚀 How to Use

1. Open [leetcode.com/problemset/](https://leetcode.com/problemset/) or any problem page.
2. Badges and solved icons are automatically hidden.
3. Click the **LeetCloak** icon in the browser toolbar to customize settings with live preview.

---

## ⚙️ Settings

- **Master Switch**: Toggle the entire extension ON / OFF.
- **Difficulty Display Modes**:
  - `Hidden`: Completely hides badges (default).
  - `Reveal on Hover`: Blurs badges, unblurring when hovered.
  - `Placeholder`: Replaces badges with a clean `—` marker.
- **Feature Toggles**:
  - `Problem Set Difficulty`: Hide difficulty column on `/problemset/`.
  - `Problem Solving Difficulty`: Hide badge next to problem title.
  - `Similar Questions`: Hide difficulty in related questions.
  - `Solved Status & Checkmarks`: Hide "Solved" banners and checkmark icons.
