infile := "news.txt"
bufferFile := "buffer.ndjson"
existingNdJson := "all.ndjson"
allAll := "new-all.ndjson"

fetchAndMerge:
	deno run --allow-net ./isbn2json.ts < {{infile}} | sort | sort -m - {{existingNdJson}} > {{allAll}}
	mv {{allAll}} {{existingNdJson}}

toBuffer in=infile out=bufferFile:
	deno run --allow-net ./isbn2json.ts < {{in}} | sort > {{out}}

mergeBufferIn in=bufferFile out=existingNdJson buffer=allAll:
	sort -m {{in}} {{out}} > {{buffer}}
	mv {{buffer}} {{out}}
