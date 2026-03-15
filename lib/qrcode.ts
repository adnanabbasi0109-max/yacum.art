import QRCode from "qrcode";

export async function generateQRCode(verseId: string): Promise<string> {
  const url = `https://yacum.art/verse/${verseId}`;

  const dataUrl = await QRCode.toDataURL(url, {
    width: 200,
    color: {
      dark: "#0A0A0A",
      light: "#00000000",
    },
  });

  return dataUrl;
}
