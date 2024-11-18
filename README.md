# ![The Accessibles Logo](./assets/icons/icon24.png) Web Accessor-Ease

A browser extension that empowers users to customize their web browsing experience based on their personal accessibility needs.

## 🎯 Features

- Customize website accessibility settings on the fly
- Personalized accessibility preferences persist within browser through web navigation
- Quick toggles for common accessibility needs:
  - Font size adjustments
  - Contrast enhancement
  - Color modifications
  - Navigation assistance
  - Text-to-speech integration

## 🚀 Installation

### Chrome Web Store
*Coming soon*

### Manual Installation
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## 🛠️ Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Getting Started
```bash
# Clone the repository
git clone https://github.com/ShaneByrne0963/hackathon-nov-2024

# Navigate to project directory
cd hackathon-nov-2024

# Install dependencies
npm install

# Build the extension
npm run build
```

## UI/UX Design

### Color Scheme
```css
:root {
    --black: 0, 0, 0; /* #000000 */
    --white: 255, 255, 255; /* #FFFFFF */
    --offwhite: 250, 250, 250; /* #FAFAFA */

    --united-red: 255, 0, 0; /* #FF0000 */
    --united-orange: 255, 127, 0; /* #FF7F00 */
    --united-yellow: 255, 255, 0; /* #FFFF00 */
    --united-green: 0, 255, 0; /* #00FF00 */
    --united-blue: 0, 0, 255; /* #0000FF */
    --united-indigo: 75, 0, 130; /* #4B0082 */
    --united-violet: 139, 0, 255; /* #8B00FF */

    --united-grey-light: 125, 125, 125; /* #7D7D7D */
    --united-grey-dark: 58, 58, 58; /* #3A3A3A */

    --united-primary: 241, 26, 123; /* #F11A7B */
    --united-secondary: 152, 33, 118; /* #982176 */
    --united-tertiary: 0, 101, 119;  /* #006577 */
    --united-quaternary: 255, 201, 83; /* #FFC953 */
}
```

### Typography
- [Lato](https://fonts.google.com/specimen/Lato) for all secondary text
- [Font Awesome](https://fontawesome.com) icons used throughout the site

## Testing

### Manual Testing

- **Form Inputs**
  - All name inputs, checkboxes, and number inputs are required
  - Number inputs have default values for invalid entries
- **User Interaction**
  - Javascript disabled notifications implemented
- **Anchors and Buttons**
  - All links tested and working as intended
  - External pages open in new tabs
- **Media Queries**
  - Responsive design tested down to 320px width
- **Cross-Browser**
  - Tested on Google Chrome and Mozilla Firefox

### Validator Testing

- HTML files passed through W3C Markup Validator
- CSS files passed through Jigsaw W3C Validator
- Javascript files passed through JsHint Validator
- Contrast testing completed for all color combinations
- Lighthouse testing completed for performance metrics

### Bugs
Currently no known unfixed bugs

## Release History

[![GitHub commit activity](https://img.shields.io/github/commit-activity/t/ShaneByrne0963/hackathon-nov-2024)](https://github.com/ShaneByrne0963/hackathon-nov-2024/commits/main)
[![GitHub last commit](https://img.shields.io/github/last-commit/ShaneByrne0963/hackathon-nov-2024)](https://github.com/ShaneByrne0963/hackathon-nov-2024/commits/main)
[![GitHub contributors](https://img.shields.io/github/contributors/ShaneByrne0963/hackathon-nov-2024)](https://github.com/ShaneByrne0963/hackathon-nov-2024)
[![GitHub PRs](https://img.shields.io/github/issues-pr-closed/ShaneByrne0963/hackathon-nov-2024)](https://github.com/ShaneByrne0963/hackathon-nov-2024/commits/main)

## Credits

### Content
- [Local storage tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Session storage tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
- [Window resize event](https://stackoverflow.com/questions/641857/javascript-window-resize-event)

### Media
- Images from [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:SVG_?_)

## 👥 Team

The Accessibles Team:
- Shane Byrne - [GitHub](https://github.com/ShaneByrne0963) | [LinkedIn](https://www.linkedin.com/in/shane-byrne-00b8b3272/)
- Vasilika Schnitzer - [GitHub](https://github.com/RikaIljina) | [LinkedIn](https://www.linkedin.com/in/vasilika-schnitzer/)
- Alan Cruz - [GitHub](https://github.com/llancruzz) | [LinkedIn](https://www.linkedin.com/in/llancruzz/)
- Nonty Dazana - [GitHub](https://github.com/NontyD) | [LinkedIn](https://www.linkedin.com/in/nontyd/)
- Trevor Leslie - [GitHub](https://github.com/TrevorJamesLeslie) | [LinkedIn](https://www.linkedin.com/in/trevor-leslie-12b4493a/)
- Mike Sealey - [GitHub](https://github.com/mikesealey) | [LinkedIn](https://www.linkedin.com/in/mike-sealey-6439573a/)
- Mikael Johnsson - [GitHub](https://github.com/mikael-johnsson) | [LinkedIn](https://www.linkedin.com/in/mikael-johnsson/)

## 🙌 Acknowledgments

- Special thanks to Code Institute for hosting the hackathon
- Icons generated using AI tools (OpenAI's ChatGPT/Anthropic's Claude)
- Additional tools used: Photoscissors.com, DaVinci, Canva

## 🔜 Future Development Roadmap

- [ ] Support for additional browsers
- [ ] Enhanced screen reader integration
- [ ] Text-to-speech improvements
- [ ] User feedback system implementation
- [ ] Additional customization options
- [ ] Performance optimizations

---

Made with ❤️ for accessibility by The Accessibles Team
