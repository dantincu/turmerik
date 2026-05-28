# Turmerik Apps

## General rules

The following rules apply to all projects on this machine:
- All apps should support dark mode by giving the user the option to manually switch between dark and light mode. By default (unless the user has explicitly toggled the dark mode) the light mode should be used, even if the OS-level preferences are for dark mode. For web apps, when the user toggles the dark mode the option should be saved in localStorage with the key "theme" and the value either "dark" or "light". Based upon this value (the default being "light") the corresponding css class should be set on the html element. This should be done inside an inline javascript script that sits as high as possible in the html document (certainly above all other script tags).
- All (especially web) apps should display a "loading" content before the actual app loads and renders. Noth this loading content and the styles relevant for it for dark and light mode should sit directly into the loaded html document (for web apps) - the css should sit inline in a "style" element.

## Referenced external instruction files

Here are some files that contain instructions and strategies relevant to all the projects on this machine:
- [Turmerik Notes Strategy](F:/T/turmerik/Notes/Turmerik%20Notes%20Strategy.md) contains the Turmerik strategy I use to take notes 