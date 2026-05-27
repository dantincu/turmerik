# Turmerik Notes Strategy

History: normally, whenever I wanted to write something down on my devices, I would create a markdown file representing a note, name the file after the note title, and for nesting notes purposes I would use the device's file system to create a directory where to store all the nested notes for a given note and name that directory using the note title too. But this way, if nesting multiple levels of notes each having rather long names, I easily end up with really long file paths and that becomes a problem on Windows (and OneDrive itself, actually) because Windows imposes a max file path length of 260 characters. And despite the fact that Windows allows disabling this path, many applications are still affected by this limit (even when I disable it at the OS level).

So for this reason I came up with a different idea for nesting notes inside a parent note: instead of creating a folder whose name is the title of the parent note, I create 2 folders, one whose name is a 3-digits string (I'll call this the "note index"), and another that starts with the same 3-digits string, then the dash character, and then the actual note title (itself having invalid file name characters removed from it - with slash being replaced by the percent character and any non-space whitespace replaced by the space - and then its final length being trimmed to 100 characters max - I call this result string "the full name part). I call the 2 folders the "short name folder" and the "full name folder" and together they make up "the note's folders pair". Inside the full name folder I add a file named ".keep" whose content consists of a single character: the dash. And inside the short name folder will sit the note's files and nested notes. So there will be the markdown file holding the note's content. The name of this file consists of the prefix "0-", then the note's full name part (mentioned above), then the suffix "[note]" and then the ".md" extension. Whenever a note is created or edited, after saving the markdown contents in this file, a html file is created whose name is the complete name of the markdown file followed by the extension ".html" so its name will end in ".md.html". The html file will hold the html markup generated from the markdown content. Then a pdf file will be created whose name is the same as the name of the html file but with the ".pdf" extension, so it ends in ".md.pdf". This pdf file will be generated from the previously generated html file. After generating the pdf file, if the note's markdown consists of nothing more than a primary heading, then the html file is deleted (alternatively, the pdf file can be created directly from the html markup string that sits in the memory of the notes application being used, so the html file is not created at all if it's not meant to be kept due to the condition I mentioned above). Besides these 3 files, there should be a json file named "[note].json" which has the following structure:

```json
{
  "Title": "My Note",
  "CreatedAt": "2026-05-27T06:14:53.7646081Z",
  "UpdatedAt": "2026-05-27T06:14:57.2247873Z"
}
```

Then there should be a json file called "[note-children].json" that has the following structure:

```json
{
  "ChildNotes": {
    "999": {
      "Title": "My Nested Note 1",
      "CreatedAt": "2026-05-27T06:16:18.3364927Z"
    },
    "998": {
      "Title": "My Nested Note 2",
      "CreatedAt": "2026-05-27T06:16:22.0495861Z",
      "UpdatedAt": "2026-05-27T06:16:39.6745931Z"
    }
  }
}
```

In all such files the time stamps are serialized using the UTC time zone.

Whenever a note's markdown is updated, the markdown, html and pdf files must be updated from the new markdown content and the "[note].json" file should have its "UpdatedAt" property updated too. A notes application should check whether the primary heading has been modified and if so, rename the relevant files and folders:
- the note's markdown, html and pdf files
- the note's full name folder's name

and also update the parent note's "[note-children].json" json file's contents.

Now getting back at the 3-digits number that represents the note index: these numbers will be allowed to sit inside the following intervals:
- 999-400 (plain notes)
- 199-110 (primary note sections)
- 299-200 (secondary note sections)
- 399-300 (ternary note sections)

So when creating a note, the user must decide whether to create a plain note, primary note section, secondary note section or ternary note section. Let's call these "note categories". Based on this choice the appropriate interval is picked up by the app and the index for the note to be created will be calculated by extracting the indexes from the existing pairs of folders from the current folder (either a note's short name folder or the notebook's root folder), taking the smallest index found in the interval corresponding to the chosen note category and decrementing it by 1. If by doing so the edge of the interval has been reached, throw an error to let the user know.

So each note can contain nested notes structured as pairs of folders. Besides the pairs of folders representing nested notes, there will be a special kind of pairs of folders that I will call "internal folder pairs". The user won't be able to create such pairs of folders directly. Just like short folder name for note folder pairs consists of a 3-digit number, the short folder name for the internal folder pairs will consist of the digit zero followed by 1 non-zero digit (for example "01"). Similarily to how a note folder pair's next index is calculated by decrementing from the smallest existing index in the interval, the index for an internal folder pair will be incremented from the greatest existing internal folder pair index. Finally there can only be 3 types of internal folder pairs:
- note files folder pair: the full name part will always be "[note-files]"
- note internals folder pair: the full name part will always be "[note-internals]"
- notebook internals folder pair: the full name part will always be "[note-book]"

The note files folder pair will contain files and folders attached to the current note (parent for the rest of the folder pairs in the current directory) - they will be directly accessed by the user, who can upload, create, edit and delete them as they wish.