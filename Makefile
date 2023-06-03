infile := "news.txt"
bufferFile := "buffer.ndjson"
existingNdJson := "all.ndjson"
allAll := "new-all.ndjson"

fetchAndMerge:
	deno run --allow-net ./isbn2json.ts < {{infile}} | sort | sort -m - {{existingNdJson}} > {{allAll}}
	mv {{allAll}} {{existingNdJson}}

toBuffer:
	deno run --allow-net ./isbn2json.ts < {{infile}} | sort > {{bufferFile}}

mergeBufferIn:
	sort -m {{bufferFile}} {{existingNdJson}} > {{allAll}}
	mv {{bufferFile}} {{existingNdJson}}
