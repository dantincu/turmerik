using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Turmerik.Core.Helpers
{
    public static class XmlSrlzH
    {
        public static string ToXml<TData>(this TData data, Type type = null)
        {
            type = type ?? typeof(TData);
            XmlSerializer xmlSerializer = new XmlSerializer(type);

            string xmlString;

            using (StringWriter sw = new StringWriter())
            {
                xmlSerializer.Serialize(sw, data);
                xmlString = sw.ToString();
            }

            return xmlString;
        }

        public static TData FromXml<TData>(this string xmlString, Type type = null)
        {
            type = type ?? typeof(TData);
            XmlSerializer xmlSerializer = new XmlSerializer(type);

            TData data;

            using (StringReader sr = new StringReader(xmlString))
            {
                object obj = xmlSerializer.Deserialize(sr);

                if (obj != null)
                {
                    data = (TData)obj;
                }
                else
                {
                    data = default;
                }
            }

            return data;
        }
    }
}
