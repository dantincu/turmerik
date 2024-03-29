﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DirsPair;

namespace Turmerik.DirsPair.ConsoleApps.MkFsDirPairs
{
    public class ProgramArgs
    {
        public string WorkDir { get; set; }

        public Node Current { get; set; }

        public List<Node> CurrentSibblings { get; set; }
        public List<Node> RootNodes { get; set; }

        public class Node
        {
            public string Url { get; set; }
            public string Uri { get; set; }
            public bool OpenMdFile { get; set; }
            public bool SkipMdFileCreation { get; set; }
            public string Title { get; set; }
            public string ResTitle { get; set; }
            public string MdFirstContent { get; set; }
            public string ShortDirName { get; set; }
            public string FullDirNamePart { get; set; }
            public string FullDirNameJoinStr { get; set; }
            public DirsPairConfig.DirNameTplT DirNameTpl { get; set; }
            public bool CreateNote { get; set; }
            public bool CreateNoteBook { get; set; }
            public bool CreateNoteInternalsDir { get; set; }
            public bool CreateNoteFilesDir { get; set; }

            public int ArgsCount { get; set; }
            public Node ParentNode { get; set; }
            public List<Node> ChildNodes { get; set; }
        }
    }
}
