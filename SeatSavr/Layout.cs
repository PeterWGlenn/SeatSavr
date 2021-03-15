using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SeatSavr
{
    public class Layout
    {
        public string Name { get; set; }

        public string Address { get; set; }

        public Bitmap LayoutImage { get; set; }

        public bool IsDefined()
        {
            return Address != null;
        }

        public bool HasImage()
        {
            return LayoutImage != null;
        }

        public byte[] ConvertImageToBytes()
        {
            ImageConverter converter = new ImageConverter();
            return (byte[])converter.ConvertTo(LayoutImage, typeof(byte[]));
        }

        public void DecodeLayoutImage(string base64String)
        {
            Bitmap bmpReturn = null;

            byte[] byteBuffer = Convert.FromBase64String(base64String);
            MemoryStream memoryStream = new MemoryStream(byteBuffer);
            memoryStream.Position = 0;

            bmpReturn = (Bitmap)Bitmap.FromStream(memoryStream);

            memoryStream.Close();
            memoryStream = null;
            byteBuffer = null;

            LayoutImage = bmpReturn;
        }
    }
}
