# Obsidian Callout Autocomplete Plugin

This plugin enhances your Obsidian experience by providing an autocomplete dropdown for callout types when you type `> [!`. It supports both default Obsidian callouts (e.g., `note`, `info`, `warning`) and custom callouts defined via the **Callout Manager** plugin. The dropdown displays callout names with their corresponding icons and colors, styled similarly to the **Admonition** plugin.

## Features
- **Autocomplete for Callouts**: Start typing `> [!` to see a dropdown with all available callout types.
- **Support for Default and Custom Callouts**: Includes standard Obsidian callouts and custom ones from Callout Manager.
- **Icons and Colors**: Each callout type in the dropdown is displayed with its icon and color, matching the callout's appearance.
- **Dynamic Updates**: Automatically updates the list of callouts when you add or modify custom callouts in Callout Manager, without needing to restart Obsidian.
- **Styled Dropdown**: The dropdown is styled to match the look and feel of the Admonition plugin, with customizable sizes and spacing.

## Installation
1. **Manual Installation**:
   - Download the latest release from the [Releases](https://github.com/albertuss/obsidian-callout-autocomplete/releases) page.
   - Extract the archive and copy the `obsidian-callout-autocomplete` folder to your Obsidian plugins directory: `<vault>/.obsidian/plugins/`.
   - In Obsidian, go to **Settings → Community Plugins**, and enable **Callout Autocomplete**.

2. **Via BRAT (Beta Reviewers Auto-update Tool)**:
   - Install the **BRAT** plugin in Obsidian.
   - In BRAT settings, add this repository: `https://github.com/albertuss/obsidian-callout-autocomplete`.
   - Enable the **Callout Autocomplete** plugin.

## Usage
- Type `> [!` in any note.
- A dropdown will appear with all available callout types.
- Use the arrow keys to navigate, and press **Enter** to select a callout type.
- The selected type will be inserted, and Obsidian will automatically add the closing bracket (`]`).

## Dependencies
- **Callout Manager** (optional): If installed, the plugin will fetch custom callout types and their settings (icons, colors).

## Customization
- To adjust the appearance of the dropdown (e.g., sizes, spacing), modify the CSS in `main.ts` under the `style.textContent` section. Refer to the comments in the code for guidance.

## Contributing
Contributions are welcome! If you have suggestions, bug reports, or want to contribute code:
1. Fork this repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to your fork (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License
This plugin is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Credits
- Inspired by the **Admonition** plugin for styling.
- Built with the Obsidian API.