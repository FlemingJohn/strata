export function decodeChainName(hexEncodedName: string): string {
  if (!hexEncodedName.startsWith("0x")) {
    return hexEncodedName;
  }

  const characters: string[] = [];

  for (let position = 2; position < hexEncodedName.length; position += 2) {
    const characterCode = parseInt(hexEncodedName.slice(position, position + 2), 16);
    characters.push(String.fromCharCode(characterCode));
  }

  return characters.join("");
}
