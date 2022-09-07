import {readLines} from "https://deno.land/std@0.154.0/io/buffer.ts";

type FullName = string
type Role = string
// dunno lol
type Type = 'edition' | 'text' | string
type OpenLibraryBook = {
	publishers: string[];
	number_of_pages: number;
	isbn_10: string[];
	key: `/books/${string}`;
	authors: {key: `/authors/${string}`}[];
	ocaid: string;
	contributions: `${FullName} (${Role})`[];
	languages: {key: `/languages/${string}`}[];
	classifications: Record<string, unknown>
	source_records: string[];
	title: string;
	identifiers: {goodreads: string[]; libraryThing: string[]};
	isbn_13: string[];
	local_id: string[];
	publish_date: string[];
	works: {key: `/works/${string}`}[];
	type: {key: `/type/${Type}`};
	first_sentence: {type: `/type/${Type}`; value: string};
	latest_revision: number;
	revision: number;
	created: {type: `/type/${Type}`; value: Date};
	last_modified: {type: `/type/${Type}`; value: Date};
}

const q = path => fetch (new URL (`${path}.json`, 'https://openlibrary.org'))
	.then (r => r.ok ? r.json() : r.text ().then (Promise.reject))
const getter = (isbn: string) => q (`/isbn/${isbn}`)
	.then ((o: OpenLibraryBook) => Promise.all ((o.authors ?? []).map (({key}) => q (key)))
		.then (authors => ({...o, authors}))
	)
const LDfy = (o: Record<string, unknown>) => JSON.stringify (o)

const openLibraryHref = path => children => (
	`<a href='${new URL (path, 'https://openlibrary.org').toString ()}'>${children}</a>`
)
const getDownToTheThingsICareAbout = (p) => {
	const {
		key,
		title,
		sub_title,
		identifiers: {librarything = [], goodreads = []} = {},
		description: {value: description} = {},
		by_statement,
		subjects,
		isbn_10 = [],
		isbn_13 = [],
		publish_date,
		number_of_pages,
		authors,
		...rest
	} = p
	const otherLinks = [
		...librarything.map ((id: string[]) => (
			`<a href='https://www.librarything.com/work/${id}'>Library Thing</a>`
		)),
		...goodreads.map ((id: string[]) => (
			`<a href='https://www.goodreads.com/book/show/${id}'>goodreads</a>`
		)),
	]
	const name = openLibraryHref (key) (title)
	const by = by_statement ?? authors?.map (({key, name}) => openLibraryHref (key) (name))
	return {
		plaintextTitle: title,
		name,
		sub_title,
		isbns: [...isbn_10, ...isbn_13],
		numberOfPages: number_of_pages,
		subjects,
		otherLinks,
		description,
		by,
		publish_date,
	}
}

for await (const l of readLines (Deno.stdin)) {
	getter (l)
		.then (o => console.log (LDfy (getDownToTheThingsICareAbout (o))))
		.catch (e => console.error (e))
}
