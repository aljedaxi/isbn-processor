# ISBN PROCESSOR — PRETTY BAREBONES NGL

This is currently hyper optimized for my use case. The output format is visible in [this file](./all.ndjson); you can change it by editing `getDownToTheThingsICareAbout` in [isbn2json.ts](./isbn2json.ts). Documentation on how to use the code is available in [the justfile](./justfile).

The way i've been getting the ISBNs is by using [binary eye](https://f-droid.org/en/packages/de.markusfisch.android.binaryeye/)'s continuous scanning mode, going into the history, and sharing the entire history as line delimited txt. you can then save to file called `news.txt` and run `just toBuffer news.txt all.ndjson` and that *should* work. 
