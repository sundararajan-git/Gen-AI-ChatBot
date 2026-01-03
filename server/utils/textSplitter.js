

export const splitTextIntoChunks = (text, maxChunkSize = 1000) => {

    const chunks = []
    let currentChunk = ''

    const paragraphs = text.split(/\n\s*\n/)

    for (const para of paragraphs) {
        if ((currentChunk.length + para.length) > maxChunkSize) {
            if (currentChunk.trim()) chunks.push(currentChunk.trim());
            currentChunk = para;
        } else {
            currentChunk += '\n\n' + para;
        }

        while (currentChunk.length > maxChunkSize) {
            chunks.push(currentChunk.substring(0, maxChunkSize));
            currentChunk = currentChunk.substring(maxChunkSize);
        }
    }

    if (currentChunk.trim()) chunks.push(currentChunk.trim());

    return chunks;

}

