

# 01 - Introduntion



## Overview

Svelte is a framework for building user interfaces on the web. It uses a compiler to turn declarative components written in HTML, CSS and JavaScript...

```svelte
<!--- file: App.svelte --->
<script>
function greet() {
	alert('Welcome to Svelte!');
}
</script>

<button onclick={greet}>click me</button>

<style>
	button {
		font-size: 2em;
	}
</style>
```

...into lean, tightly optimized JavaScript.

You can use it to build anything on the web, from standalone components to ambitious full stack apps (using Svelte's companion application framework, [SvelteKit](../kit)) and everything in between.

These pages serve as reference documentation. If you're new to Svelte, we recommend starting with the [interactive tutorial](/tutorial) and coming back here when you have questions.

You can also try Svelte online in the [playground](/playground) or, if you need a more fully-featured environment, on [StackBlitz](https://sveltekit.new).

## Getting started

We recommend using [SvelteKit](../kit), the official application framework from the Svelte team powered by [Vite](https://vite.dev/):

```bash
npx sv create myapp
cd myapp
npm install
npm run dev
```

### Alternatives to SvelteKit

You can also use Svelte directly with Vite by running `npm create vite@latest` and selecting the `svelte` option. With this, `npm run build` will generate HTML, JS and CSS files inside the `dist` directory using [vite-plugin-svelte](https://github.com/sveltejs/vite-plugin-svelte). In most cases, you will probably need to [choose a routing library](faq#Is-there-a-router) as well.

There are also plugins for [Rollup](https://github.com/sveltejs/rollup-plugin-svelte), [Webpack](https://github.com/sveltejs/svelte-loader) [and a few others](https://sveltesociety.dev/packages?category=build-plugins), but we recommend Vite.

## Editor tooling

The Svelte team maintains a [VS Code extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) and there are integrations with various other [editors](https://sveltesociety.dev/resources#editor-support) and tools as well.

You can also check your code from the command line using [sv check](https://github.com/sveltejs/cli).

## Svelte files

Components are the building blocks of Svelte applications. They are written into `.svelte` files, using a superset of HTML.

All three sections — script, styles and markup — are optional.

<!-- prettier-ignore -->
```svelte
/// file: MyComponent.svelte
<script module>
	// module-level logic goes here
	// (you will rarely use this)
</script>

<script>
	// instance-level logic goes here
</script>

<!-- markup (zero or more items) goes here -->

<style>
	/* styles go here */
</style>
```

## `<script>`

A `<script>` block contains JavaScript (or TypeScript, when adding the `lang="ts"` attribute) that runs when a component instance is created. Variables declared (or imported) at the top level can be referenced in the component's markup.

In addition to normal JavaScript, you can use _runes_ to declare [component props]($props) and add reactivity to your component. Runes are covered in the next section.

<!-- TODO describe behaviour of `export` -->

## `<script module>`

A `<script>` tag with a `module` attribute runs once when the module first evaluates, rather than for each component instance. Variables declared in this block can be referenced elsewhere in the component, but not vice versa.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
	console.log(`instantiated ${total} times`);
</script>
```

You can `export` bindings from this block, and they will become exports of the compiled module. You cannot `export default`, since the default export is the component itself.

> [!NOTE] If you are using TypeScript and import such exports from a `module` block into a `.ts` file, make sure to have your editor setup so that TypeScript knows about them. This is the case for our VS Code extension and the IntelliJ plugin, in other cases you might need to setup our [TypeScript editor plugin](https://www.npmjs.com/package/typescript-svelte-plugin).

> [!LEGACY]
> In Svelte 4, this script tag was created using `<script context="module">`

## `<style>`

CSS inside a `<style>` block will be scoped to that component.

```svelte
<style>
	p {
		/* this will only affect <p> elements in this component */
		color: burlywood;
	}
</style>
```

For more information, head to the section on [styling](scoped-styles).

## Svelte `js` files

Besides `.svelte` files, Svelte also operates on `.svelte.js` and `.svelte.ts` files.

These behave like any other `.js` or `.ts` module, except that you can use runes. This is useful for creating reusable reactive logic, or sharing reactive state across your app.

> [!LEGACY]
> This is a concept that didn't exist prior to Svelte 5

### Public API of a component

Svelte uses the `$props` rune to declare _properties_ or _props_, which means describing the public interface of the component which becomes accessible to consumers of the component.

> [!NOTE] `$props` is one of several runes, which are special hints for Svelte's compiler to make things reactive.

```svelte
<script>
	let { foo, bar, baz } = $props();

	// Values that are passed in as props
	// are immediately available
	console.log({ foo, bar, baz });
</script>
```

You can specify a fallback value for a prop. It will be used if the component's consumer doesn't specify the prop on the component when instantiating the component, or if the passed value is `undefined` at some point.

```svelte
<script>
	let { foo = 'optional default initial value' } = $props();
</script>
```

To get all properties, use rest syntax:

```svelte
<script>
 let { a, b, c, ...everythingElse } = $props();
</script>
```

You can use reserved words as prop names.

```svelte
<script>
	// creates a `class` property, even
	// though it is a reserved word
	let { class: className } = $props();
</script>
```

If you're using TypeScript, you can declare the prop types:

```svelte
<script lang="ts">
	interface Props {
		required: string;
		optional?: number;
		[key: string]: unknown;
	}

	let { required, optional, ...everythingElse }: Props = $props();
</script>
```

If you're using JavaScript, you can declare the prop types using JSDoc:

```svelte
<script>
	/** @type {{ x: string }} */
	let { x } = $props();

	// or use @typedef if you want to document the properties:

	/**
	 * @typedef {Object} MyProps
	 * @property {string} y Some documentation
	 */

	/** @type {MyProps} */
	let { y } = $props();
</script>
```

If you export a `const`, `class` or `function`, it is readonly from outside the component.

```svelte
<script>
 export const thisIs = 'readonly';

 export function greet(name) {
  alert(`hello ${name}!`);
 }
</script>
```

Readonly props can be accessed as properties on the element, tied to the component using [`bind:this` syntax](bindings#bind:this).

### Reactive variables

To change component state and trigger a re-render, just assign to a locally declared variable that was declared using the `$state` rune.

Update expressions (`count += 1`) and property assignments (`obj.x = y`) have the same effect.

```svelte
<script>
 let count = $state(0);

  function handleClick() {
  // calling this function will trigger an
  // update if the markup references `count`
  count = count + 1;
 }
</script>
```

Svelte's `<script>` blocks are run only when the component is created, so assignments within a `<script>` block are not automatically run again when a prop updates.

```svelte
<script>
 let { person } = $props();
 // this will only set `name` on component creation
 // it will not update when `person` does
 let { name } = person;
</script>
```

If you'd like to react to changes to a prop, use the `$derived` or `$effect` runes instead.

```svelte
<script>
  let count = $state(0);
  let double = $derived(count * 2);

 $effect(() => {
  if (count > 10) {
   alert('Too high!');
   }
  });

 </script>
```

For more information on reactivity, read the documentation around runes.

## Reactivity fundamentals

Reactivity is at the heart of interactive UIs. When you click a button, you expect some kind of response. It's your job as a developer to make this happen. It's Svelte's job to make your job as intuitive as possible, by providing a good API to express reactive systems.

## Runes

Svelte 5 uses _runes_, a powerful set of primitives for controlling reactivity inside your Svelte components and inside `.svelte.js` and `.svelte.ts` modules.

Runes are function-like symbols that provide instructions to the Svelte compiler. You don't need to import them from anywhere — when you use Svelte, they're part of the language.

The following sections introduce the most important runes for declare state, derived state and side effects at a high level. For more details refer to the later sections on [state](../01-introduction/state) and [side effects](../01-introduction/side-effects).

## `$state`

Reactive state is declared with the `$state` rune:

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

You can also use `$state` in class fields (whether public or private):

```js
// @errors: 7006 2554
class Todo {
	done = $state(false);
	text = $state();

	constructor(text) {
		this.text = text;
	}
}
```

> [!LEGACY]
> In Svelte 4, state was implicitly reactive if the variable was declared at the top level
>
> ```svelte
> <script>
> 	let count = 0;
> </script>
>
> <button on:click={() => count++}>
> 	clicks: {count}
> </button>
> ```

## `$derived`

Derived state is declared with the `$derived` rune:

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
	{doubled}
</button>

<p>{count} doubled is {doubled}</p>
```

The expression inside `$derived(...)` should be free of side-effects. Svelte will disallow state changes (e.g. `count++`) inside derived expressions.

As with `$state`, you can mark class fields as `$derived`.

> [!LEGACY]
> In Svelte 4, you could use reactive statements for this.
>
> ```svelte
> <script>
> 	let count = 0;
> 	$: doubled = count * 2;
> </script>
>
> <button on:click={() => count++}>
> 	{doubled}
> </button>
>
> <p>{count} doubled is {doubled}</p>
> ```
>
> This only worked at the top level of a component.

## `$effect`

To run _side-effects_ when the component is mounted to the DOM, and when values change, we can use the `$effect` rune ([demo](/playground/untitled#H4sIAAAAAAAAE31T24rbMBD9lUG7kAQ2sbdlX7xOYNk_aB_rQhRpbAsU2UiTW0P-vbrYubSlYGzmzMzROTPymdVKo2PFjzMzfIusYB99z14YnfoQuD1qQh-7bmdFQEonrOppVZmKNBI49QthCc-OOOH0LZ-9jxnR6c7eUpOnuv6KeT5JFdcqbvbcBcgDz1jXKGg6ncFyBedYR6IzLrAZwiN5vtSxaJA-EzadfJEjKw11C6GR22-BLH8B_wxdByWpvUYtqqal2XB6RVkG1CoHB6U1WJzbnYFDiwb3aGEdDa3Bm1oH12sQLTcNPp7r56m_00mHocSG97_zd7ICUXonA5fwKbPbkE2ZtMJGGVkEdctzQi4QzSwr9prnFYNk5hpmqVuqPQjNnfOJoMF22lUsrq_UfIN6lfSVyvQ7grB3X2mjMZYO3XO9w-U5iLx42qg29md3BP_ni5P4gy9ikTBlHxjLzAtPDlyYZmRdjAbGq7HprEQ7p64v4LU_guu0kvAkhBim3nMplWl8FreQD-CW20aZR0wq12t-KqDWeBywhvexKC3memmDwlHAv9q4Vo2ZK8KtK0CgX7u9J8wXbzdKv-nRnfF_2baTqlYoWUF2h5efl9-n0O6koAMAAA==)):

```svelte
<script>
	let size = $state(50);
	let color = $state('#ff3e00');

	let canvas;

	$effect(() => {
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);

		// this will re-run whenever `color` or `size` change
		context.fillStyle = color;
		context.fillRect(0, 0, size, size);
	});
</script>

<canvas bind:this={canvas} width="100" height="100" />
```

The function passed to `$effect` will run when the component mounts, and will re-run after any changes to the values it reads that were declared with `$state` or `$derived` (including those passed in with `$props`). Re-runs are batched (i.e. changing `color` and `size` in the same moment won't cause two separate runs), and happen after any DOM updates have been applied.

> [!LEGACY]
> In Svelte 4, you could use reactive statements for this.
>
> ```svelte
> <script>
> 	let size = 50;
> 	let color = '#ff3e00';
>
> 	let canvas;
>
> 	$: {
> 		const context = canvas.getContext('2d');
> 		context.clearRect(0, 0, canvas.width, canvas.height);
>
> 		// this will re-run whenever `color` or `size` change
> 		context.fillStyle = color;
> 		context.fillRect(0, 0, size, size);
> 	}
> </script>
>
> <canvas bind:this={canvas} width="100" height="100" />
> ```
>
> This only worked at the top level of a component.

## Routing

At the heart of SvelteKit is a _filesystem-based router_. The routes of your app — i.e. the URL paths that users can access — are defined by the directories in your codebase:

- `src/routes` is the root route
- `src/routes/about` creates an `/about` route
- `src/routes/blog/[slug]` creates a route with a _parameter_, `slug`, that can be used to load data dynamically when a user requests a page like `/blog/hello-world`

> [!NOTE] You can change `src/routes` to a different directory by editing the [project config](configuration).

Each route directory contains one or more _route files_, which can be identified by their `+` prefix.

We'll introduce these files in a moment in more detail, but here are a few simple rules to help you remember how SvelteKit's routing works:

- All files can run on the server
- All files run on the client except `+server` files
- `+layout` and `+error` files apply to subdirectories as well as the directory they live in

## +page

### +page.svelte

A `+page.svelte` component defines a page of your app. By default, pages are rendered both on the server ([SSR](glossary#SSR)) for the initial request and in the browser ([CSR](glossary#CSR)) for subsequent navigation.

```svelte
<!--- file: src/routes/+page.svelte --->
<h1>Hello and welcome to my site!</h1>
<a href="/about">About my site</a>
```

```svelte
<!--- file: src/routes/about/+page.svelte --->
<h1>About this site</h1>
<p>TODO...</p>
<a href="/">Home</a>
```

Pages can receive data from `load` functions via the `data` prop.

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();
</script>

<h1>{data.title}</h1>
<div>{@html data.content}</div>
```

> [!LEGACY]
> In Svelte 4, you'd use `export let data` instead

> [!NOTE] Note that SvelteKit uses `<a>` elements to navigate between routes, rather than a framework-specific `<Link>` component.

### +page.js

Often, a page will need to load some data before it can be rendered. For this, we add a `+page.js` module that exports a `load` function:

```js
/// file: src/routes/blog/[slug]/+page.js
import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  if (params.slug === "hello-world") {
    return {
      title: "Hello world!",
      content: "Welcome to our blog. Lorem ipsum dolor sit amet...",
    };
  }

  error(404, "Not found");
}
```

This function runs alongside `+page.svelte`, which means it runs on the server during server-side rendering and in the browser during client-side navigation. See [`load`](load) for full details of the API.

As well as `load`, `+page.js` can export values that configure the page's behaviour:

- `export const prerender = true` or `false` or `'auto'`
- `export const ssr = true` or `false`
- `export const csr = true` or `false`

You can find more information about these in [page options](page-options).

### +page.server.js

If your `load` function can only run on the server — for example, if it needs to fetch data from a database or you need to access private [environment variables]($env-static-private) like API keys — then you can rename `+page.js` to `+page.server.js` and change the `PageLoad` type to `PageServerLoad`.

```js
/// file: src/routes/blog/[slug]/+page.server.js

// @filename: ambient.d.ts
declare global {
  const getPostFromDatabase: (slug: string) => {
    title: string;
    content: string;
  }
}

export {};

// @filename: index.js
// ---cut---
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const post = await getPostFromDatabase(params.slug);

  if (post) {
    return post;
  }

  error(404, 'Not found');
}
```

During client-side navigation, SvelteKit will load this data from the server, which means that the returned value must be serializable using [devalue](https://github.com/rich-harris/devalue). See [`load`](load) for full details of the API.

Like `+page.js`, `+page.server.js` can export [page options](page-options) — `prerender`, `ssr` and `csr`.

A `+page.server.js` file can also export _actions_. If `load` lets you read data from the server, `actions` let you write data _to_ the server using the `<form>` element. To learn how to use them, see the [form actions](form-actions) section.

## +error

If an error occurs during `load`, SvelteKit will render a default error page. You can customise this error page on a per-route basis by adding an `+error.svelte` file:

```svelte
<!--- file: src/routes/blog/[slug]/+error.svelte --->
<script>
  import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error.message}</h1>
```

SvelteKit will 'walk up the tree' looking for the closest error boundary — if the file above didn't exist it would try `src/routes/blog/+error.svelte` and then `src/routes/+error.svelte` before rendering the default error page. If _that_ fails (or if the error was thrown from the `load` function of the root `+layout`, which sits 'above' the root `+error`), SvelteKit will bail out and render a static fallback error page, which you can customise by creating a `src/error.html` file.

If the error occurs inside a `load` function in `+layout(.server).js`, the closest error boundary in the tree is an `+error.svelte` file _above_ that layout (not next to it).

If no route can be found (404), `src/routes/+error.svelte` (or the default error page, if that file does not exist) will be used.

> [!NOTE] `+error.svelte` is _not_ used when an error occurs inside [`handle`](hooks#Server-hooks-handle) or a [+server.js](#server) request handler.

You can read more about error handling [here](errors).

## +layout

So far, we've treated pages as entirely standalone components — upon navigation, the existing `+page.svelte` component will be destroyed, and a new one will take its place.

But in many apps, there are elements that should be visible on _every_ page, such as top-level navigation or a footer. Instead of repeating them in every `+page.svelte`, we can put them in _layouts_.

### +layout.svelte

To create a layout that applies to every page, make a file called `src/routes/+layout.svelte`. The default layout (the one that SvelteKit uses if you don't bring your own) looks like this...

```svelte
<script>
  let { children } = $props();
</script>

{@render children()}
```

...but we can add whatever markup, styles and behaviour we want. The only requirement is that the component includes a `@render` tag for the page content. For example, let's add a nav bar:

```svelte
<!---- file: src/routes/+layout.svelte --->
<script>
  let { children } = $props();
</script>

<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/settings">Settings</a>
</nav>

{@render children()}
```

If we create pages for `/`, `/about` and `/settings`...

```html
/// file: src/routes/+page.svelte
<h1>Home</h1>
```

```html
/// file: src/routes/about/+page.svelte
<h1>About</h1>
```

```html
/// file: src/routes/settings/+page.svelte
<h1>Settings</h1>
```

...the nav will always be visible, and clicking between the three pages will only result in the `<h1>` being replaced.

Layouts can be _nested_. Suppose we don't just have a single `/settings` page, but instead have nested pages like `/settings/profile` and `/settings/notifications` with a shared submenu (for a real-life example, see [github.com/settings](https://github.com/settings)).

We can create a layout that only applies to pages below `/settings` (while inheriting the root layout with the top-level nav):

```svelte
<!--- file: src/routes/settings/+layout.svelte --->
<script>
  /** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
  let { data, children } = $props();
</script>

<h1>Settings</h1>

<div class="submenu">
  {#each data.sections as section}
    <a href="/settings/{section.slug}">{section.title}</a>
  {/each}
</div>

{@render children()}
```

You can see how `data` is populated by looking at the `+layout.js` example in the next section just below.

By default, each layout inherits the layout above it. Sometimes that isn't what you want - in this case, [advanced layouts](advanced-routing#Advanced-layouts) can help you.

### +layout.js

Just like `+page.svelte` loading data from `+page.js`, your `+layout.svelte` component can get data from a [`load`](load) function in `+layout.js`.

```js
/// file: src/routes/settings/+layout.js
/** @type {import('./$types').LayoutLoad} */
export function load() {
  return {
    sections: [
      { slug: "profile", title: "Profile" },
      { slug: "notifications", title: "Notifications" },
    ],
  };
}
```

If a `+layout.js` exports [page options](page-options) — `prerender`, `ssr` and `csr` — they will be used as defaults for child pages.

Data returned from a layout's `load` function is also available to all its child pages:

```svelte
<!--- file: src/routes/settings/profile/+page.svelte --->
<script>
  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();

  console.log(data.sections); // [{ slug: 'profile', title: 'Profile' }, ...]
</script>
```

> [!NOTE] Often, layout data is unchanged when navigating between pages. SvelteKit will intelligently rerun [`load`](load) functions when necessary.

### +layout.server.js

To run your layout's `load` function on the server, move it to `+layout.server.js`, and change the `LayoutLoad` type to `LayoutServerLoad`.

Like `+layout.js`, `+layout.server.js` can export [page options](page-options) — `prerender`, `ssr` and `csr`.

## +server

As well as pages, you can define routes with a `+server.js` file (sometimes referred to as an 'API route' or an 'endpoint'), which gives you full control over the response. Your `+server.js` file exports functions corresponding to HTTP verbs like `GET`, `POST`, `PATCH`, `PUT`, `DELETE`, `OPTIONS`, and `HEAD` that take a `RequestEvent` argument and return a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object.

For example we could create an `/api/random-number` route with a `GET` handler:

```js
/// file: src/routes/api/random-number/+server.js
import { error } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
  const min = Number(url.searchParams.get("min") ?? "0");
  const max = Number(url.searchParams.get("max") ?? "1");

  const d = max - min;

  if (isNaN(d) || d < 0) {
    error(400, "min and max must be numbers, and min must be less than max");
  }

  const random = min + Math.random() * d;

  return new Response(String(random));
}
```

The first argument to `Response` can be a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream), making it possible to stream large amounts of data or create server-sent events (unless deploying to platforms that buffer responses, like AWS Lambda).

You can use the [`error`](@sveltejs-kit#error), [`redirect`](@sveltejs-kit#redirect) and [`json`](@sveltejs-kit#json) methods from `@sveltejs/kit` for convenience (but you don't have to).

If an error is thrown (either `error(...)` or an unexpected error), the response will be a JSON representation of the error or a fallback error page — which can be customised via `src/error.html` — depending on the `Accept` header. The [`+error.svelte`](#error) component will _not_ be rendered in this case. You can read more about error handling [here](errors).

> [!NOTE] When creating an `OPTIONS` handler, note that Vite will inject `Access-Control-Allow-Origin` and `Access-Control-Allow-Methods` headers — these will not be present in production unless you add them.

### Receiving data

By exporting `POST`/`PUT`/`PATCH`/`DELETE`/`OPTIONS`/`HEAD` handlers, `+server.js` files can be used to create a complete API:

```svelte
<!--- file: src/routes/add/+page.svelte --->
<script>
  let a = 0;
  let b = 0;
  let total = 0;

  async function add() {
    const response = await fetch('/api/add', {
      method: 'POST',
      body: JSON.stringify({ a, b }),
      headers: {
        'content-type': 'application/json'
      }
    });

    total = await response.json();
  }
</script>

<input type="number" bind:value={a}> +
<input type="number" bind:value={b}> =
{total}

<button on:click={add}>Calculate</button>
```

```js
/// file: src/routes/api/add/+server.js
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { a, b } = await request.json();
  return json(a + b);
}
```

> [!NOTE] In general, [form actions](form-actions) are a better way to submit data from the browser to the server.

> [!NOTE] If a `GET` handler is exported, a `HEAD` request will return the `content-length` of the `GET` handler's response body.

### Fallback method handler

Exporting the `fallback` handler will match any unhandled request methods, including methods like `MOVE` which have no dedicated export from `+server.js`.

```js
// @errors: 7031
/// file: src/routes/api/add/+server.js
import { json, text } from "@sveltejs/kit";

export async function POST({ request }) {
  const { a, b } = await request.json();
  return json(a + b);
}

// This handler will respond to PUT, PATCH, DELETE, etc.
/** @type {import('./$types').RequestHandler} */
export async function fallback({ request }) {
  return text(`I caught your ${request.method} request!`);
}
```

> [!NOTE] For `HEAD` requests, the `GET` handler takes precedence over the `fallback` handler.

### Content negotiation

`+server.js` files can be placed in the same directory as `+page` files, allowing the same route to be either a page or an API endpoint. To determine which, SvelteKit applies the following rules:

- `PUT`/`PATCH`/`DELETE`/`OPTIONS` requests are always handled by `+server.js` since they do not apply to pages
- `GET`/`POST`/`HEAD` requests are treated as page requests if the `accept` header prioritises `text/html` (in other words, it's a browser page request), else they are handled by `+server.js`.
- Responses to `GET` requests will include a `Vary: Accept` header, so that proxies and browsers cache HTML and JSON responses separately.

## $types

Throughout the examples above, we've been importing types from a `$types.d.ts` file. This is a file SvelteKit creates for you in a hidden directory if you're using TypeScript (or JavaScript with JSDoc type annotations) to give you type safety when working with your root files.

For example, annotating `let { data } = $props()` with `PageData` (or `LayoutData`, for a `+layout.svelte` file) tells TypeScript that the type of `data` is whatever was returned from `load`:

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();
</script>
```

In turn, annotating the `load` function with `PageLoad`, `PageServerLoad`, `LayoutLoad` or `LayoutServerLoad` (for `+page.js`, `+page.server.js`, `+layout.js` and `+layout.server.js` respectively) ensures that `params` and the return value are correctly typed.

If you're using VS Code or any IDE that supports the language server protocol and TypeScript plugins then you can omit these types _entirely_! Svelte's IDE tooling will insert the correct types for you, so you'll get type checking without writing them yourself. It also works with our command line tool `svelte-check`.

You can read more about omitting `$types` in our [blog post](/blog/zero-config-type-safety) about it.

## Other files

Any other files inside a route directory are ignored by SvelteKit. This means you can colocate components and utility modules with the routes that need them.

If components and modules are needed by multiple routes, it's a good idea to put them in [`$lib`]($lib).

## Loading data

Before a [`+page.svelte`](routing#page-page.svelte) component (and its containing [`+layout.svelte`](routing#layout-layout.svelte) components) can be rendered, we often need to get some data. This is done by defining `load` functions.

## Page data

A `+page.svelte` file can have a sibling `+page.js` that exports a `load` function, the return value of which is available to the page via the `data` prop:

```js
/// file: src/routes/blog/[slug]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  return {
    post: {
      title: `Title for ${params.slug} goes here`,
      content: `Content for ${params.slug} goes here`,
    },
  };
}
```

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
```

> [!LEGACY]
> In Svelte 4, you'd use `export let data` instead

Thanks to the generated `$types` module, we get full type safety.

A `load` function in a `+page.js` file runs both on the server and in the browser (unless combined with `export const ssr = false`, in which case it will [only run in the browser](page-options#ssr)). If your `load` function should _always_ run on the server (because it uses private environment variables, for example, or accesses a database) then it would go in a `+page.server.js` instead.

A more realistic version of your blog post's `load` function, that only runs on the server and pulls data from a database, might look like this:

```js
/// file: src/routes/blog/[slug]/+page.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
  export function getPost(slug: string): Promise<{ title: string, content: string }>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  return {
    post: await db.getPost(params.slug)
  };
}
```

Notice that the type changed from `PageLoad` to `PageServerLoad`, because server `load` functions can access additional arguments. To understand when to use `+page.js` and when to use `+page.server.js`, see [Universal vs server](load#Universal-vs-server).

## Layout data

Your `+layout.svelte` files can also load data, via `+layout.js` or `+layout.server.js`.

```js
/// file: src/routes/blog/[slug]/+layout.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
  export function getPostSummaries(): Promise<Array<{ title: string, slug: string }>>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  return {
    posts: await db.getPostSummaries()
  };
}
```

```svelte
<!--- file: src/routes/blog/[slug]/+layout.svelte --->
<script>
  /** @type {{ data: import('./$types').LayoutData, children: Snippet }} */
  let { data, children } = $props();
</script>

<main>
  <!-- +page.svelte is `@render`ed here -->
  {@render children()}
</main>

<aside>
  <h2>More posts</h2>
  <ul>
    {#each data.posts as post}
      <li>
        <a href="/blog/{post.slug}">
          {post.title}
        </a>
      </li>
    {/each}
  </ul>
</aside>
```

Data returned from layout `load` functions is available to child `+layout.svelte` components and the `+page.svelte` component as well as the layout that it 'belongs' to.

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
<script>
  +++import { page } from '$app/stores';+++

  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();

+++	// we can access `data.posts` because it's returned from
  // the parent layout `load` function
  let index = $derived(data.posts.findIndex(post => post.slug === $page.params.slug));
  let next = $derived(data.posts[index + 1]);+++
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>

+++{#if next}
  <p>Next post: <a href="/blog/{next.slug}">{next.title}</a></p>
{/if}+++
```

> [!NOTE] If multiple `load` functions return data with the same key, the last one 'wins' — the result of a layout `load` returning `{ a: 1, b: 2 }` and a page `load` returning `{ b: 3, c: 4 }` would be `{ a: 1, b: 3, c: 4 }`.

## $page.data

The `+page.svelte` component, and each `+layout.svelte` component above it, has access to its own data plus all the data from its parents.

In some cases, we might need the opposite — a parent layout might need to access page data or data from a child layout. For example, the root layout might want to access a `title` property returned from a `load` function in `+page.js` or `+page.server.js`. This can be done with `$page.data`:

```svelte
<!--- file: src/routes/+layout.svelte --->
<script>
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>{$page.data.title}</title>
</svelte:head>
```

Type information for `$page.data` is provided by `App.PageData`.

## Universal vs server

As we've seen, there are two types of `load` function:

- `+page.js` and `+layout.js` files export _universal_ `load` functions that run both on the server and in the browser
- `+page.server.js` and `+layout.server.js` files export _server_ `load` functions that only run server-side

Conceptually, they're the same thing, but there are some important differences to be aware of.

### When does which load function run?

Server `load` functions _always_ run on the server.

By default, universal `load` functions run on the server during SSR when the user first visits your page. They will then run again during hydration, reusing any responses from [fetch requests](#Making-fetch-requests). All subsequent invocations of universal `load` functions happen in the browser. You can customize the behavior through [page options](page-options). If you disable [server side rendering](page-options#ssr), you'll get an SPA and universal `load` functions _always_ run on the client.

If a route contains both universal and server `load` functions, the server `load` runs first.

A `load` function is invoked at runtime, unless you [prerender](page-options#prerender) the page — in that case, it's invoked at build time.

### Input

Both universal and server `load` functions have access to properties describing the request (`params`, `route` and `url`) and various functions (`fetch`, `setHeaders`, `parent`, `depends` and `untrack`). These are described in the following sections.

Server `load` functions are called with a `ServerLoadEvent`, which inherits `clientAddress`, `cookies`, `locals`, `platform` and `request` from `RequestEvent`.

Universal `load` functions are called with a `LoadEvent`, which has a `data` property. If you have `load` functions in both `+page.js` and `+page.server.js` (or `+layout.js` and `+layout.server.js`), the return value of the server `load` function is the `data` property of the universal `load` function's argument.

### Output

A universal `load` function can return an object containing any values, including things like custom classes and component constructors.

A server `load` function must return data that can be serialized with [devalue](https://github.com/rich-harris/devalue) — anything that can be represented as JSON plus things like `BigInt`, `Date`, `Map`, `Set` and `RegExp`, or repeated/cyclical references — so that it can be transported over the network. Your data can include [promises](#Streaming-with-promises), in which case it will be streamed to browsers.

### When to use which

Server `load` functions are convenient when you need to access data directly from a database or filesystem, or need to use private environment variables.

Universal `load` functions are useful when you need to `fetch` data from an external API and don't need private credentials, since SvelteKit can get the data directly from the API rather than going via your server. They are also useful when you need to return something that can't be serialized, such as a Svelte component constructor.

In rare cases, you might need to use both together — for example, you might need to return an instance of a custom class that was initialised with data from your server. When using both, the server `load` return value is _not_ passed directly to the page, but to the universal `load` function (as the `data` property):

```js
/// file: src/routes/+page.server.js
/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return {
    serverMessage: "hello from server load function",
  };
}
```

```js
/// file: src/routes/+page.js
// @errors: 18047
/** @type {import('./$types').PageLoad} */
export async function load({ data }) {
  return {
    serverMessage: data.serverMessage,
    universalMessage: "hello from universal load function",
  };
}
```

## Using URL data

Often the `load` function depends on the URL in one way or another. For this, the `load` function provides you with `url`, `route` and `params`.

### url

An instance of [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL), containing properties like the `origin`, `hostname`, `pathname` and `searchParams` (which contains the parsed query string as a [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) object). `url.hash` cannot be accessed during `load`, since it is unavailable on the server.

> [!NOTE] In some environments this is derived from request headers during server-side rendering. If you're using [adapter-node](adapter-node), for example, you may need to configure the adapter in order for the URL to be correct.

### route

Contains the name of the current route directory, relative to `src/routes`:

```js
/// file: src/routes/a/[b]/[...c]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ route }) {
  console.log(route.id); // '/a/[b]/[...c]'
}
```

### params

`params` is derived from `url.pathname` and `route.id`.

Given a `route.id` of `/a/[b]/[...c]` and a `url.pathname` of `/a/x/y/z`, the `params` object would look like this:

```json
{
  "b": "x",
  "c": "y/z"
}
```

## Making fetch requests

To get data from an external API or a `+server.js` handler, you can use the provided `fetch` function, which behaves identically to the [native `fetch` web API](https://developer.mozilla.org/en-US/docs/Web/API/fetch) with a few additional features:

- It can be used to make credentialed requests on the server, as it inherits the `cookie` and `authorization` headers for the page request.
- It can make relative requests on the server (ordinarily, `fetch` requires a URL with an origin when used in a server context).
- Internal requests (e.g. for `+server.js` routes) go directly to the handler function when running on the server, without the overhead of an HTTP call.
- During server-side rendering, the response will be captured and inlined into the rendered HTML by hooking into the `text`, `json` and `arrayBuffer` methods of the `Response` object. Note that headers will _not_ be serialized, unless explicitly included via [`filterSerializedResponseHeaders`](hooks#Server-hooks-handle).
- During hydration, the response will be read from the HTML, guaranteeing consistency and preventing an additional network request - if you received a warning in your browser console when using the browser `fetch` instead of the `load` `fetch`, this is why.

```js
/// file: src/routes/items/[id]/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
  const res = await fetch(`/api/items/${params.id}`);
  const item = await res.json();

  return { item };
}
```

## Cookies

A server `load` function can get and set [`cookies`](@sveltejs-kit#Cookies).

```js
/// file: src/routes/+layout.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
  export function getUser(sessionid: string | undefined): Promise<{ name: string, avatar: string }>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
  const sessionid = cookies.get('sessionid');

  return {
    user: await db.getUser(sessionid)
  };
}
```

Cookies will only be passed through the provided `fetch` function if the target host is the same as the SvelteKit application or a more specific subdomain of it.

For example, if SvelteKit is serving my.domain.com:

- domain.com WILL NOT receive cookies
- my.domain.com WILL receive cookies
- api.domain.com WILL NOT receive cookies
- sub.my.domain.com WILL receive cookies

Other cookies will not be passed when `credentials: 'include'` is set, because SvelteKit does not know which domain which cookie belongs to (the browser does not pass this information along), so it's not safe to forward any of them. Use the [handleFetch hook](hooks#Server-hooks-handleFetch) to work around it.

## Headers

Both server and universal `load` functions have access to a `setHeaders` function that, when running on the server, can set headers for the response. (When running in the browser, `setHeaders` has no effect.) This is useful if you want the page to be cached, for example:

```js
// @errors: 2322 1360
/// file: src/routes/products/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, setHeaders }) {
  const url = `https://cms.example.com/products.json`;
  const response = await fetch(url);

  // Headers are only set during SSR, caching the page's HTML
  // for the same length of time as the underlying data.
  setHeaders({
    age: response.headers.get("age"),
    "cache-control": response.headers.get("cache-control"),
  });

  return response.json();
}
```

Setting the same header multiple times (even in separate `load` functions) is an error. You can only set a given header once using the `setHeaders` function. You cannot add a `set-cookie` header with `setHeaders` — use `cookies.set(name, value, options)` instead.

## Using parent data

Occasionally it's useful for a `load` function to access data from a parent `load` function, which can be done with `await parent()`:

```js
/// file: src/routes/+layout.js
/** @type {import('./$types').LayoutLoad} */
export function load() {
  return { a: 1 };
}
```

```js
/// file: src/routes/abc/+layout.js
/** @type {import('./$types').LayoutLoad} */
export async function load({ parent }) {
  const { a } = await parent();
  return { b: a + 1 };
}
```

```js
/// file: src/routes/abc/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
  const { a, b } = await parent();
  return { c: a + b };
}
```

```svelte
<!--- file: src/routes/abc/+page.svelte --->
<script>
  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();
</script>

<!-- renders `1 + 2 = 3` -->
<p>{data.a} + {data.b} = {data.c}</p>
```

> [!NOTE] Notice that the `load` function in `+page.js` receives the merged data from both layout `load` functions, not just the immediate parent.

Inside `+page.server.js` and `+layout.server.js`, `parent` returns data from parent `+layout.server.js` files.

In `+page.js` or `+layout.js` it will return data from parent `+layout.js` files. However, a missing `+layout.js` is treated as a `({ data }) => data` function, meaning that it will also return data from parent `+layout.server.js` files that are not 'shadowed' by a `+layout.js` file

Take care not to introduce waterfalls when using `await parent()`. Here, for example, `getData(params)` does not depend on the result of calling `parent()`, so we should call it first to avoid a delayed render.

```js
/// file: +page.js
// @filename: ambient.d.ts
declare function getData(params: Record<string, string>): Promise<{ meta: any }>

// @filename: index.js
// ---cut---
/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
  ---const parentData = await parent();---
  const data = await getData(params);
  +++const parentData = await parent();+++

  return {
    ...data,
    meta: { ...parentData.meta, ...data.meta }
  };
}
```

## Errors

If an error is thrown during `load`, the nearest [`+error.svelte`](routing#error) will be rendered. For [_expected_](errors#Expected-errors) errors, use the `error` helper from `@sveltejs/kit` to specify the HTTP status code and an optional message:

```js
/// file: src/routes/admin/+layout.server.js
// @filename: ambient.d.ts
declare namespace App {
  interface Locals {
    user?: {
      name: string;
      isAdmin: boolean;
    }
  }
}

// @filename: index.js
// ---cut---
import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
  if (!locals.user) {
    error(401, 'not logged in');
  }

  if (!locals.user.isAdmin) {
    error(403, 'not an admin');
  }
}
```

Calling `error(...)` will throw an exception, making it easy to stop execution from inside helper functions.

If an [_unexpected_](errors#Unexpected-errors) error is thrown, SvelteKit will invoke [`handleError`](hooks#Shared-hooks-handleError) and treat it as a 500 Internal Error.

> [!NOTE] [In SvelteKit 1.x](migrating-to-sveltekit-2#redirect-and-error-are-no-longer-thrown-by-you) you had to `throw` the error yourself

## Redirects

To redirect users, use the `redirect` helper from `@sveltejs/kit` to specify the location to which they should be redirected alongside a `3xx` status code. Like `error(...)`, calling `redirect(...)` will throw an exception, making it easy to stop execution from inside helper functions.

```js
/// file: src/routes/user/+layout.server.js
// @filename: ambient.d.ts
declare namespace App {
  interface Locals {
    user?: {
      name: string;
    }
  }
}

// @filename: index.js
// ---cut---
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
  if (!locals.user) {
    redirect(307, '/login');
  }
}
```

> [!NOTE] Don't use `redirect()` inside a `try {...}` block, as the redirect will immediately trigger the catch statement.

In the browser, you can also navigate programmatically outside of a `load` function using [`goto`]($app-navigation#goto) from [`$app.navigation`]($app-navigation).

> [!NOTE] [In SvelteKit 1.x](migrating-to-sveltekit-2#redirect-and-error-are-no-longer-thrown-by-you) you had to `throw` the `redirect` yourself

## Streaming with promises

When using a server `load`, promises will be streamed to the browser as they resolve. This is useful if you have slow, non-essential data, since you can start rendering the page before all the data is available:

```js
/// file: src/routes/blog/[slug]/+page.server.js
// @filename: ambient.d.ts
declare global {
  const loadPost: (slug: string) => Promise<{ title: string, content: string }>;
  const loadComments: (slug: string) => Promise<{ content: string }>;
}

export {};

// @filename: index.js
// ---cut---
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  return {
    // make sure the `await` happens at the end, otherwise we
    // can't start loading comments until we've loaded the post
    comments: loadComments(params.slug),
    post: await loadPost(params.slug)
  };
}
```

This is useful for creating skeleton loading states, for example:

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>

{#await data.comments}
  Loading comments...
{:then comments}
  {#each comments as comment}
    <p>{comment.content}</p>
  {/each}
{:catch error}
  <p>error loading comments: {error.message}</p>
{/await}
```

When streaming data, be careful to handle promise rejections correctly. More specifically, the server could crash with an "unhandled promise rejection" error if a lazy-loaded promise fails before rendering starts (at which point it's caught) and isn't handling the error in some way. When using SvelteKit's `fetch` directly in the `load` function, SvelteKit will handle this case for you. For other promises, it is enough to attach a noop-`catch` to the promise to mark it as handled.

```js
/// file: src/routes/+page.server.js
/** @type {import('./$types').PageServerLoad} */
export function load({ fetch }) {
  const ok_manual = Promise.reject();
  ok_manual.catch(() => {});

  return {
    ok_manual,
    ok_fetch: fetch("/fetch/that/could/fail"),
    dangerous_unhandled: Promise.reject(),
  };
}
```

> [!NOTE] On platforms that do not support streaming, such as AWS Lambda or Firebase, responses will be buffered. This means the page will only render once all promises resolve. If you are using a proxy (e.g. NGINX), make sure it does not buffer responses from the proxied server.

> [!NOTE] Streaming data will only work when JavaScript is enabled. You should avoid returning promises from a universal `load` function if the page is server rendered, as these are _not_ streamed — instead, the promise is recreated when the function reruns in the browser.

> [!NOTE] The headers and status code of a response cannot be changed once the response has started streaming, therefore you cannot `setHeaders` or throw redirects inside a streamed promise.

> [!NOTE] [In SvelteKit 1.x](migrating-to-sveltekit-2#Top-level-promises-are-no-longer-awaited) top-level promises were automatically awaited, only nested promises were streamed.

## Parallel loading

When rendering (or navigating to) a page, SvelteKit runs all `load` functions concurrently, avoiding a waterfall of requests. During client-side navigation, the result of calling multiple server `load` functions are grouped into a single response. Once all `load` functions have returned, the page is rendered.

## Rerunning load functions

SvelteKit tracks the dependencies of each `load` function to avoid rerunning it unnecessarily during navigation.

For example, given a pair of `load` functions like these...

```js
/// file: src/routes/blog/[slug]/+page.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
  export function getPost(slug: string): Promise<{ title: string, content: string }>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  return {
    post: await db.getPost(params.slug)
  };
}
```

```js
/// file: src/routes/blog/[slug]/+layout.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
  export function getPostSummaries(): Promise<Array<{ title: string, slug: string }>>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  return {
    posts: await db.getPostSummaries()
  };
}
```

...the one in `+page.server.js` will rerun if we navigate from `/blog/trying-the-raw-meat-diet` to `/blog/i-regret-my-choices` because `params.slug` has changed. The one in `+layout.server.js` will not, because the data is still valid. In other words, we won't call `db.getPostSummaries()` a second time.

A `load` function that calls `await parent()` will also rerun if a parent `load` function is rerun.

Dependency tracking does not apply _after_ the `load` function has returned — for example, accessing `params.x` inside a nested [promise](#Streaming-with-promises) will not cause the function to rerun when `params.x` changes. (Don't worry, you'll get a warning in development if you accidentally do this.) Instead, access the parameter in the main body of your `load` function.

Search parameters are tracked independently from the rest of the url. For example, accessing `event.url.searchParams.get("x")` inside a `load` function will make that `load` function re-run when navigating from `?x=1` to `?x=2`, but not when navigating from `?x=1&y=1` to `?x=1&y=2`.

### Untracking dependencies

In rare cases, you may wish to exclude something from the dependency tracking mechanism. You can do this with the provided `untrack` function:

```js
/// file: src/routes/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ untrack, url }) {
  // Untrack url.pathname so that path changes don't trigger a rerun
  if (untrack(() => url.pathname === "/")) {
    return { message: "Welcome!" };
  }
}
```

### Manual invalidation

You can also rerun `load` functions that apply to the current page using [`invalidate(url)`]($app-navigation#invalidate), which reruns all `load` functions that depend on `url`, and [`invalidateAll()`]($app-navigation#invalidateAll), which reruns every `load` function. Server load functions will never automatically depend on a fetched `url` to avoid leaking secrets to the client.

A `load` function depends on `url` if it calls `fetch(url)` or `depends(url)`. Note that `url` can be a custom identifier that starts with `[a-z]:`:

```js
/// file: src/routes/random-number/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, depends }) {
  // load reruns when `invalidate('https://api.example.com/random-number')` is called...
  const response = await fetch("https://api.example.com/random-number");

  // ...or when `invalidate('app:random')` is called
  depends("app:random");

  return {
    number: await response.json(),
  };
}
```

```svelte
<!--- file: src/routes/random-number/+page.svelte --->
<script>
  import { invalidate, invalidateAll } from '$app/navigation';

  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();

  function rerunLoadFunction() {
    // any of these will cause the `load` function to rerun
    invalidate('app:random');
    invalidate('https://api.example.com/random-number');
    invalidate(url => url.href.includes('random-number'));
    invalidateAll();
  }
</script>

<p>random number: {data.number}</p>
<button on:click={rerunLoadFunction}>Update random number</button>
```

### When do load functions rerun?

To summarize, a `load` function will rerun in the following situations:

- It references a property of `params` whose value has changed
- It references a property of `url` (such as `url.pathname` or `url.search`) whose value has changed. Properties in `request.url` are _not_ tracked
- It calls `url.searchParams.get(...)`, `url.searchParams.getAll(...)` or `url.searchParams.has(...)` and the parameter in question changes. Accessing other properties of `url.searchParams` will have the same effect as accessing `url.search`.
- It calls `await parent()` and a parent `load` function reran
- A child `load` function calls `await parent()` and is rerunning, and the parent is a server load function
- It declared a dependency on a specific URL via [`fetch`](#Making-fetch-requests) (universal load only) or [`depends`](@sveltejs-kit#LoadEvent), and that URL was marked invalid with [`invalidate(url)`]($app-navigation#invalidate)
- All active `load` functions were forcibly rerun with [`invalidateAll()`]($app-navigation#invalidateAll)

`params` and `url` can change in response to a `<a href="..">` link click, a [`<form>` interaction](form-actions#GET-vs-POST), a [`goto`]($app-navigation#goto) invocation, or a [`redirect`](@sveltejs-kit#redirect).

Note that rerunning a `load` function will update the `data` prop inside the corresponding `+layout.svelte` or `+page.svelte`; it does _not_ cause the component to be recreated. As a result, internal state is preserved. If this isn't what you want, you can reset whatever you need to reset inside an [`afterNavigate`]($app-navigation#afterNavigate) callback, and/or wrap your component in a [`{#key ...}`](../svelte/key) block.

## Implications for authentication

A couple features of loading data have important implications for auth checks:

- Layout `load` functions do not run on every request, such as during client side navigation between child routes. [(When do load functions rerun?)](load#Rerunning-load-functions-When-do-load-functions-rerun)
- Layout and page `load` functions run concurrently unless `await parent()` is called. If a layout `load` throws, the page `load` function runs, but the client will not receive the returned data.

There are a few possible strategies to ensure an auth check occurs before protected code.

To prevent data waterfalls and preserve layout `load` caches:

- Use [hooks](hooks) to protect multiple routes before any `load` functions run
- Use auth guards directly in `+page.server.js` `load` functions for route specific protection

Putting an auth guard in `+layout.server.js` requires all child pages to call `await parent()` before protected code. Unless every child page depends on returned data from `await parent()`, the other options will be more performant.

## Form actions

A `+page.server.js` file can export _actions_, which allow you to `POST` data to the server using the `<form>` element.

When using `<form>`, client-side JavaScript is optional, but you can easily _progressively enhance_ your form interactions with JavaScript to provide the best user experience.

## Default actions

In the simplest case, a page declares a `default` action:

```js
/// file: src/routes/login/+page.server.js
/** @satisfies {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    // TODO log the user in
  },
};
```

To invoke this action from the `/login` page, just add a `<form>` — no JavaScript needed:

```svelte
<!--- file: src/routes/login/+page.svelte --->
<form method="POST">
  <label>
    Email
    <input name="email" type="email">
  </label>
  <label>
    Password
    <input name="password" type="password">
  </label>
  <button>Log in</button>
</form>
```

If someone were to click the button, the browser would send the form data via `POST` request to the server, running the default action.

> [!NOTE] Actions always use `POST` requests, since `GET` requests should never have side-effects.

We can also invoke the action from other pages (for example if there's a login widget in the nav in the root layout) by adding the `action` attribute, pointing to the page:

```html
/// file: src/routes/+layout.svelte
<form method="POST" action="/login">
  <!-- content -->
</form>
```

## Named actions

Instead of one `default` action, a page can have as many named actions as it needs:

```js
/// file: src/routes/login/+page.server.js
/** @satisfies {import('./$types').Actions} */
export const actions = {
---	default: async (event) => {---
+++	login: async (event) => {+++
    // TODO log the user in
  },
+++	register: async (event) => {
    // TODO register the user
  }+++
};
```

To invoke a named action, add a query parameter with the name prefixed by a `/` character:

```svelte
<!--- file: src/routes/login/+page.svelte --->
<form method="POST" action="?/register">
```

```svelte
<!--- file: src/routes/+layout.svelte --->
<form method="POST" action="/login?/register">
```

As well as the `action` attribute, we can use the `formaction` attribute on a button to `POST` the same form data to a different action than the parent `<form>`:

```svelte
/// file: src/routes/login/+page.svelte
<form method="POST" +++action="?/login"+++>
  <label>
    Email
    <input name="email" type="email">
  </label>
  <label>
    Password
    <input name="password" type="password">
  </label>
  <button>Log in</button>
  +++<button formaction="?/register">Register</button>+++
</form>
```

> [!NOTE] We can't have default actions next to named actions, because if you POST to a named action without a redirect, the query parameter is persisted in the URL, which means the next default POST would go through the named action from before.

## Anatomy of an action

Each action receives a `RequestEvent` object, allowing you to read the data with `request.formData()`. After processing the request (for example, logging the user in by setting a cookie), the action can respond with data that will be available through the `form` property on the corresponding page and through `$page.form` app-wide until the next update.

```js
/// file: src/routes/login/+page.server.js
// @filename: ambient.d.ts
declare module '$lib/server/db';

// @filename: index.js
// ---cut---
import * as db from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  const user = await db.getUserFromSession(cookies.get('sessionid'));
  return { user };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    const user = await db.getUser(email);
    cookies.set('sessionid', await db.createSession(user), { path: '/' });

    return { success: true };
  },
  register: async (event) => {
    // TODO register the user
  }
};
```

```svelte
<!--- file: src/routes/login/+page.svelte --->
<script>
  /** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
  let { data, form } = $props();
</script>

{#if form?.success}
  <!-- this message is ephemeral; it exists because the page was rendered in
         response to a form submission. it will vanish if the user reloads -->
  <p>Successfully logged in! Welcome back, {data.user.name}</p>
{/if}
```

> [!LEGACY]
> In Svelte 4, you'd use `export let data` and `export let form` instead to declare properties

### Validation errors

If the request couldn't be processed because of invalid data, you can return validation errors — along with the previously submitted form values — back to the user so that they can try again. The `fail` function lets you return an HTTP status code (typically 400 or 422, in the case of validation errors) along with the data. The status code is available through `$page.status` and the data through `form`:

```js
/// file: src/routes/login/+page.server.js
// @filename: ambient.d.ts
declare module '$lib/server/db';

// @filename: index.js
// ---cut---
+++import { fail } from '@sveltejs/kit';+++
import * as db from '$lib/server/db';

/** @satisfies {import('./$types').Actions} */
export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

+++		if (!email) {
      return fail(400, { email, missing: true });
    }+++

    const user = await db.getUser(email);

+++		if (!user || user.password !== db.hash(password)) {
      return fail(400, { email, incorrect: true });
    }+++

    cookies.set('sessionid', await db.createSession(user), { path: '/' });

    return { success: true };
  },
  register: async (event) => {
    // TODO register the user
  }
};
```

> [!NOTE] Note that as a precaution, we only return the email back to the page — not the password.

```svelte
/// file: src/routes/login/+page.svelte
<form method="POST" action="?/login">
+++	{#if form?.missing}<p class="error">The email field is required</p>{/if}
  {#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}+++
  <label>
    Email
    <input name="email" type="email" +++value={form?.email ?? ''}+++>
  </label>
  <label>
    Password
    <input name="password" type="password">
  </label>
  <button>Log in</button>
  <button formaction="?/register">Register</button>
</form>
```

The returned data must be serializable as JSON. Beyond that, the structure is entirely up to you. For example, if you had multiple forms on the page, you could distinguish which `<form>` the returned `form` data referred to with an `id` property or similar.

### Redirects

Redirects (and errors) work exactly the same as in [`load`](load#Redirects):

```js
// @errors: 2345
/// file: src/routes/login/+page.server.js
// @filename: ambient.d.ts
declare module '$lib/server/db';

// @filename: index.js
// ---cut---
import { fail, +++redirect+++ } from '@sveltejs/kit';
import * as db from '$lib/server/db';

/** @satisfies {import('./$types').Actions} */
export const actions = {
  login: async ({ cookies, request, +++url+++ }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    const user = await db.getUser(email);
    if (!user) {
      return fail(400, { email, missing: true });
    }

    if (user.password !== db.hash(password)) {
      return fail(400, { email, incorrect: true });
    }

    cookies.set('sessionid', await db.createSession(user), { path: '/' });

+++		if (url.searchParams.has('redirectTo')) {
      redirect(303, url.searchParams.get('redirectTo'));
    }+++

    return { success: true };
  },
  register: async (event) => {
    // TODO register the user
  }
};
```

## Loading data

After an action runs, the page will be re-rendered (unless a redirect or an unexpected error occurs), with the action's return value available to the page as the `form` prop. This means that your page's `load` functions will run after the action completes.

Note that `handle` runs before the action is invoked, and does not rerun before the `load` functions. This means that if, for example, you use `handle` to populate `event.locals` based on a cookie, you must update `event.locals` when you set or delete the cookie in an action:

```js
/// file: src/hooks.server.js
// @filename: ambient.d.ts
declare namespace App {
  interface Locals {
    user: {
      name: string;
    } | null
  }
}

// @filename: global.d.ts
declare global {
  function getUser(sessionid: string | undefined): {
    name: string;
  };
}

export {};

// @filename: index.js
// ---cut---
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  event.locals.user = await getUser(event.cookies.get('sessionid'));
  return resolve(event);
}
```

```js
/// file: src/routes/account/+page.server.js
// @filename: ambient.d.ts
declare namespace App {
  interface Locals {
    user: {
      name: string;
    } | null
  }
}

// @filename: index.js
// ---cut---
/** @type {import('./$types').PageServerLoad} */
export function load(event) {
  return {
    user: event.locals.user
  };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
  logout: async (event) => {
    event.cookies.delete('sessionid', { path: '/' });
    event.locals.user = null;
  }
};
```

## Progressive enhancement

In the preceding sections we built a `/login` action that [works without client-side JavaScript](https://kryogenix.org/code/browser/everyonehasjs.html) — not a `fetch` in sight. That's great, but when JavaScript _is_ available we can progressively enhance our form interactions to provide a better user experience.

### use:enhance

The easiest way to progressively enhance a form is to add the `use:enhance` action:

```svelte
/// file: src/routes/login/+page.svelte
<script>
  +++import { enhance } from '$app/forms';+++

  /** @type {{ form: import('./$types').ActionData }} */
  let { form } = $props();
</script>

<form method="POST" +++use:enhance+++>
```

> [!NOTE] `use:enhance` can only be used with forms that have `method="POST"`. It will not work with `method="GET"`, which is the default for forms without a specified method. Attempting to use `use:enhance` on forms without `method="POST"` will result in an error.

> [!NOTE] Yes, it's a little confusing that the `enhance` action and `<form action>` are both called 'action'. These docs are action-packed. Sorry.

Without an argument, `use:enhance` will emulate the browser-native behaviour, just without the full-page reloads. It will:

- update the `form` property, `$page.form` and `$page.status` on a successful or invalid response, but only if the action is on the same page you're submitting from. For example, if your form looks like `<form action="/somewhere/else" ..>`, `form` and `$page` will _not_ be updated. This is because in the native form submission case you would be redirected to the page the action is on. If you want to have them updated either way, use [`applyAction`](#Progressive-enhancement-Customising-use:enhance)
- reset the `<form>` element
- invalidate all data using `invalidateAll` on a successful response
- call `goto` on a redirect response
- render the nearest `+error` boundary if an error occurs
- [reset focus](accessibility#Focus-management) to the appropriate element

### Customising use:enhance

To customise the behaviour, you can provide a `SubmitFunction` that runs immediately before the form is submitted, and (optionally) returns a callback that runs with the `ActionResult`. Note that if you return a callback, the default behavior mentioned above is not triggered. To get it back, call `update`.

```svelte
<form
  method="POST"
  use:enhance={({ formElement, formData, action, cancel, submitter }) => {
    // `formElement` is this `<form>` element
    // `formData` is its `FormData` object that's about to be submitted
    // `action` is the URL to which the form is posted
    // calling `cancel()` will prevent the submission
    // `submitter` is the `HTMLElement` that caused the form to be submitted

    return async ({ result, update }) => {
      // `result` is an `ActionResult` object
      // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
    };
  }}
>
```

You can use these functions to show and hide loading UI, and so on.

If you return a callback, you may need to reproduce part of the default `use:enhance` behaviour, but without invalidating all data on a successful response. You can do so with `applyAction`:

```svelte
/// file: src/routes/login/+page.svelte
<script>
  import { enhance, +++applyAction+++ } from '$app/forms';

  /** @type {{ form: import('./$types').ActionData }} */
  let { form } = $props();
</script>

<form
  method="POST"
  use:enhance={({ formElement, formData, action, cancel }) => {
    return async ({ result }) => {
      // `result` is an `ActionResult` object
+++			if (result.type === 'redirect') {
        goto(result.location);
      } else {
        await applyAction(result);
      }+++
    };
  }}
>
```

The behaviour of `applyAction(result)` depends on `result.type`:

- `success`, `failure` — sets `$page.status` to `result.status` and updates `form` and `$page.form` to `result.data` (regardless of where you are submitting from, in contrast to `update` from `enhance`)
- `redirect` — calls `goto(result.location, { invalidateAll: true })`
- `error` — renders the nearest `+error` boundary with `result.error`

In all cases, [focus will be reset](accessibility#Focus-management).

### Custom event listener

We can also implement progressive enhancement ourselves, without `use:enhance`, with a normal event listener on the `<form>`:

```svelte
<!--- file: src/routes/login/+page.svelte --->
<script>
  import { invalidateAll, goto } from '$app/navigation';
  import { applyAction, deserialize } from '$app/forms';

  /** @type {{ form: import('./$types').ActionData }} */
  let { form } = $props();

  /** @param {{ currentTarget: EventTarget & HTMLFormElement}} event */
  async function handleSubmit(event) {
    const data = new FormData(event.currentTarget);

    const response = await fetch(event.currentTarget.action, {
      method: 'POST',
      body: data
    });

    /** @type {import('@sveltejs/kit').ActionResult} */
    const result = deserialize(await response.text());

    if (result.type === 'success') {
      // rerun all `load` functions, following the successful update
      await invalidateAll();
    }

    applyAction(result);
  }
</script>

<form method="POST" on:submit|preventDefault={handleSubmit}>
  <!-- content -->
</form>
```

Note that you need to `deserialize` the response before processing it further using the corresponding method from `$app/forms`. `JSON.parse()` isn't enough because form actions - like `load` functions - also support returning `Date` or `BigInt` objects.

If you have a `+server.js` alongside your `+page.server.js`, `fetch` requests will be routed there by default. To `POST` to an action in `+page.server.js` instead, use the custom `x-sveltekit-action` header:

```js
const response = await fetch(this.action, {
  method: 'POST',
  body: data,
+++	headers: {
    'x-sveltekit-action': 'true'
  }+++
});
```

## Alternatives

Form actions are the preferred way to send data to the server, since they can be progressively enhanced, but you can also use [`+server.js`](routing#server) files to expose (for example) a JSON API. Here's how such an interaction could look like:

```svelte
<!--- file: src/routes/send-message/+page.svelte --->
<script>
  function rerun() {
    fetch('/api/ci', {
      method: 'POST'
    });
  }
</script>

<button on:click={rerun}>Rerun CI</button>
```

```js
// @errors: 2355 1360 2322
/// file: src/routes/api/ci/+server.js
/** @type {import('./$types').RequestHandler} */
export function POST() {
  // do something
}
```

## GET vs POST

As we've seen, to invoke a form action you must use `method="POST"`.

Some forms don't need to `POST` data to the server — search inputs, for example. For these you can use `method="GET"` (or, equivalently, no `method` at all), and SvelteKit will treat them like `<a>` elements, using the client-side router instead of a full page navigation:

```html
<form action="/search">
  <label>
    Search
    <input name="q" />
  </label>
</form>
```

Submitting this form will navigate to `/search?q=...` and invoke your load function but will not invoke an action. As with `<a>` elements, you can set the [`data-sveltekit-reload`](link-options#data-sveltekit-reload), [`data-sveltekit-replacestate`](link-options#data-sveltekit-replacestate), [`data-sveltekit-keepfocus`](link-options#data-sveltekit-keepfocus) and [`data-sveltekit-noscroll`](link-options#data-sveltekit-noscroll) attributes on the `<form>` to control the router's behaviour.

## Page options

By default, SvelteKit will render (or [prerender](glossary#Prerendering)) any component first on the server and send it to the client as HTML. It will then render the component again in the browser to make it interactive in a process called [**hydration**](glossary#Hydration). For this reason, you need to ensure that components can run in both places. SvelteKit will then initialize a [**router**](routing) that takes over subsequent navigations.

You can control each of these on a page-by-page basis by exporting options from [`+page.js`](routing#page-page.js) or [`+page.server.js`](routing#page-page.server.js), or for groups of pages using a shared [`+layout.js`](routing#layout-layout.js) or [`+layout.server.js`](routing#layout-layout.server.js). To define an option for the whole app, export it from the root layout. Child layouts and pages override values set in parent layouts, so — for example — you can enable prerendering for your entire app then disable it for pages that need to be dynamically rendered.

You can mix and match these options in different areas of your app. For example you could prerender your marketing page for maximum speed, server-render your dynamic pages for SEO and accessibility and turn your admin section into an SPA by rendering it on the client only. This makes SvelteKit very versatile.

## prerender

It's likely that at least some routes of your app can be represented as a simple HTML file generated at build time. These routes can be [_prerendered_](glossary#Prerendering).

```js
/// file: +page.js/+page.server.js/+server.js
export const prerender = true;
```

Alternatively, you can set `export const prerender = true` in your root `+layout.js` or `+layout.server.js` and prerender everything except pages that are explicitly marked as _not_ prerenderable:

```js
/// file: +page.js/+page.server.js/+server.js
export const prerender = false;
```

Routes with `prerender = true` will be excluded from manifests used for dynamic SSR, making your server (or serverless/edge functions) smaller. In some cases you might want to prerender a route but also include it in the manifest (for example, with a route like `/blog/[slug]` where you want to prerender your most recent/popular content but server-render the long tail) — for these cases, there's a third option, 'auto':

```js
/// file: +page.js/+page.server.js/+server.js
export const prerender = "auto";
```

> [!NOTE] If your entire app is suitable for prerendering, you can use [`adapter-static`](https://github.com/sveltejs/kit/tree/main/packages/adapter-static), which will output files suitable for use with any static webserver.

The prerenderer will start at the root of your app and generate files for any prerenderable pages or `+server.js` routes it finds. Each page is scanned for `<a>` elements that point to other pages that are candidates for prerendering — because of this, you generally don't need to specify which pages should be accessed. If you _do_ need to specify which pages should be accessed by the prerenderer, you can do so with [`config.kit.prerender.entries`](configuration#prerender), or by exporting an [`entries`](#entries) function from your dynamic route.

While prerendering, the value of `building` imported from [`$app/environment`]($app-environment) will be `true`.

### Prerendering server routes

Unlike the other page options, `prerender` also applies to `+server.js` files. These files are _not_ affected by layouts, but will inherit default values from the pages that fetch data from them, if any. For example if a `+page.js` contains this `load` function...

```js
/// file: +page.js
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  const res = await fetch("/my-server-route.json");
  return await res.json();
}
```

...then `src/routes/my-server-route.json/+server.js` will be treated as prerenderable if it doesn't contain its own `export const prerender = false`.

### When not to prerender

The basic rule is this: for a page to be prerenderable, any two users hitting it directly must get the same content from the server.

> [!NOTE] Not all pages are suitable for prerendering. Any content that is prerendered will be seen by all users. You can of course fetch personalized data in `onMount` in a prerendered page, but this may result in a poorer user experience since it will involve blank initial content or loading indicators.

Note that you can still prerender pages that load data based on the page's parameters, such as a `src/routes/blog/[slug]/+page.svelte` route.

Accessing [`url.searchParams`](load#Using-URL-data-url) during prerendering is forbidden. If you need to use it, ensure you are only doing so in the browser (for example in `onMount`).

Pages with [actions](form-actions) cannot be prerendered, because a server must be able to handle the action `POST` requests.

### Route conflicts

Because prerendering writes to the filesystem, it isn't possible to have two endpoints that would cause a directory and a file to have the same name. For example, `src/routes/foo/+server.js` and `src/routes/foo/bar/+server.js` would try to create `foo` and `foo/bar`, which is impossible.

For that reason among others, it's recommended that you always include a file extension — `src/routes/foo.json/+server.js` and `src/routes/foo/bar.json/+server.js` would result in `foo.json` and `foo/bar.json` files living harmoniously side-by-side.

For _pages_, we skirt around this problem by writing `foo/index.html` instead of `foo`.

### Troubleshooting

If you encounter an error like 'The following routes were marked as prerenderable, but were not prerendered' it's because the route in question (or a parent layout, if it's a page) has `export const prerender = true` but the page wasn't reached by the prerendering crawler and thus wasn't prerendered.

Since these routes cannot be dynamically server-rendered, this will cause errors when people try to access the route in question. There are a few ways to fix it:

- Ensure that SvelteKit can find the route by following links from [`config.kit.prerender.entries`](configuration#prerender) or the [`entries`](#entries) page option. Add links to dynamic routes (i.e. pages with `[parameters]` ) to this option if they are not found through crawling the other entry points, else they are not prerendered because SvelteKit doesn't know what value the parameters should have. Pages not marked as prerenderable will be ignored and their links to other pages will not be crawled, even if some of them would be prerenderable.
- Ensure that SvelteKit can find the route by discovering a link to it from one of your other prerendered pages that have server-side rendering enabled.
- Change `export const prerender = true` to `export const prerender = 'auto'`. Routes with `'auto'` can be dynamically server rendered

## entries

SvelteKit will discover pages to prerender automatically, by starting at _entry points_ and crawling them. By default, all your non-dynamic routes are considered entry points — for example, if you have these routes...

```bash
/             # non-dynamic
/blog         # non-dynamic
/blog/[slug]  # dynamic, because of `[slug]`
```

...SvelteKit will prerender `/` and `/blog`, and in the process discover links like `<a href="/blog/hello-world">` which give it new pages to prerender.

Most of the time, that's enough. In some situations, links to pages like `/blog/hello-world` might not exist (or might not exist on prerendered pages), in which case we need to tell SvelteKit about their existence.

This can be done with [`config.kit.prerender.entries`](configuration#prerender), or by exporting an `entries` function from a `+page.js`, a `+page.server.js` or a `+server.js` belonging to a dynamic route:

```js
/// file: src/routes/blog/[slug]/+page.server.js
/** @type {import('./$types').EntryGenerator} */
export function entries() {
  return [{ slug: "hello-world" }, { slug: "another-blog-post" }];
}

export const prerender = true;
```

`entries` can be an `async` function, allowing you to (for example) retrieve a list of posts from a CMS or database, in the example above.

## ssr

Normally, SvelteKit renders your page on the server first and sends that HTML to the client where it's [hydrated](glossary#Hydration). If you set `ssr` to `false`, it renders an empty 'shell' page instead. This is useful if your page is unable to be rendered on the server (because you use browser-only globals like `document` for example), but in most situations it's not recommended ([see appendix](glossary#SSR)).

```js
/// file: +page.js
export const ssr = false;
// If both `ssr` and `csr` are `false`, nothing will be rendered!
```

If you add `export const ssr = false` to your root `+layout.js`, your entire app will only be rendered on the client — which essentially means you turn your app into an SPA.

## csr

Ordinarily, SvelteKit [hydrates](glossary#Hydration) your server-rendered HTML into an interactive client-side-rendered (CSR) page. Some pages don't require JavaScript at all — many blog posts and 'about' pages fall into this category. In these cases you can disable CSR:

```js
/// file: +page.js
export const csr = false;
// If both `csr` and `ssr` are `false`, nothing will be rendered!
```

Disabling CSR does not ship any JavaScript to the client. This means:

- The webpage should work with HTML and CSS only.
- `<script>` tags inside all Svelte components are removed.
- `<form>` elements cannot be [progressively enhanced](form-actions#Progressive-enhancement).
- Links are handled by the browser with a full-page navigation.
- Hot Module Replacement (HMR) will be disabled.

You can enable `csr` during development (for example to take advantage of HMR) like so:

```js
/// file: +page.js
import { dev } from "$app/environment";

export const csr = dev;
```

## trailingSlash

By default, SvelteKit will remove trailing slashes from URLs — if you visit `/about/`, it will respond with a redirect to `/about`. You can change this behaviour with the `trailingSlash` option, which can be one of `'never'` (the default), `'always'`, or `'ignore'`.

As with other page options, you can export this value from a `+layout.js` or a `+layout.server.js` and it will apply to all child pages. You can also export the configuration from `+server.js` files.

```js
/// file: src/routes/+layout.js
export const trailingSlash = "always";
```

This option also affects [prerendering](#prerender). If `trailingSlash` is `always`, a route like `/about` will result in an `about/index.html` file, otherwise it will create `about.html`, mirroring static webserver conventions.

> [!NOTE] Ignoring trailing slashes is not recommended — the semantics of relative paths differ between the two cases (`./y` from `/x` is `/y`, but from `/x/` is `/x/y`), and `/x` and `/x/` are treated as separate URLs which is harmful to SEO.

## config

With the concept of [adapters](adapters), SvelteKit is able to run on a variety of platforms. Each of these might have specific configuration to further tweak the deployment — for example on Vercel you could choose to deploy some parts of your app on the edge and others on serverless environments.

`config` is an object with key-value pairs at the top level. Beyond that, the concrete shape is dependent on the adapter you're using. Every adapter should provide a `Config` interface to import for type safety. Consult the documentation of your adapter for more information.

```js
// @filename: ambient.d.ts
declare module 'some-adapter' {
  export interface Config { runtime: string }
}

// @filename: index.js
// ---cut---
/// file: src/routes/+page.js
/** @type {import('some-adapter').Config} */
export const config = {
  runtime: 'edge'
};
```

`config` objects are merged at the top level (but _not_ deeper levels). This means you don't need to repeat all the values in a `+page.js` if you want to only override some of the values in the upper `+layout.js`. For example this layout configuration...

```js
/// file: src/routes/+layout.js
export const config = {
  runtime: "edge",
  regions: "all",
  foo: {
    bar: true,
  },
};
```

...is overridden by this page configuration...

```js
/// file: src/routes/+page.js
export const config = {
  regions: ["us1", "us2"],
  foo: {
    baz: true,
  },
};
```

...which results in the config value `{ runtime: 'edge', regions: ['us1', 'us2'], foo: { baz: true } }` for that page.

## State management

If you're used to building client-only apps, state management in an app that spans server and client might seem intimidating. This section provides tips for avoiding some common gotchas.

## Avoid shared state on the server

Browsers are _stateful_ — state is stored in memory as the user interacts with the application. Servers, on the other hand, are _stateless_ — the content of the response is determined entirely by the content of the request.

Conceptually, that is. In reality, servers are often long-lived and shared by multiple users. For that reason it's important not to store data in shared variables. For example, consider this code:

```js
// @errors: 7034 7005
/// file: +page.server.js
let user;

/** @type {import('./$types').PageServerLoad} */
export function load() {
  return { user };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    // NEVER DO THIS!
    user = {
      name: data.get("name"),
      embarrassingSecret: data.get("secret"),
    };
  },
};
```

The `user` variable is shared by everyone who connects to this server. If Alice submitted an embarrassing secret, and Bob visited the page after her, Bob would know Alice's secret. In addition, when Alice returns to the site later in the day, the server may have restarted, losing her data.

Instead, you should _authenticate_ the user using [`cookies`](load#Cookies) and persist the data to a database.

## No side-effects in load

For the same reason, your `load` functions should be _pure_ — no side-effects (except maybe the occasional `console.log(...)`). For example, you might be tempted to write to a store inside a `load` function so that you can use the store value in your components:

```js
/// file: +page.js
// @filename: ambient.d.ts
declare module '$lib/user' {
  export const user: { set: (value: any) => void };
}

// @filename: index.js
// ---cut---
import { user } from '$lib/user';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  const response = await fetch('/api/user');

  // NEVER DO THIS!
  user.set(await response.json());
}
```

As with the previous example, this puts one user's information in a place that is shared by _all_ users. Instead, just return the data...

```js
/// file: +page.js
/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  const response = await fetch('/api/user');

+++	return {
    user: await response.json()
  };+++
}
```

...and pass it around to the components that need it, or use [`$page.data`](load#$page.data).

If you're not using SSR, then there's no risk of accidentally exposing one user's data to another. But you should still avoid side-effects in your `load` functions — your application will be much easier to reason about without them.

## Using stores with context

You might wonder how we're able to use `$page.data` and other [app stores]($app-stores) if we can't use our own stores. The answer is that app stores on the server use Svelte's [context API](/tutorial/svelte/context-api) — the store is attached to the component tree with `setContext`, and when you subscribe you retrieve it with `getContext`. We can do the same thing with our own stores:

```svelte
<!--- file: src/routes/+layout.svelte --->
<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  /** @type {{ data: import('./$types').LayoutData }} */
  let { data } = $props();

  // Create a store and update it when necessary...
  const user = writable(data.user);
  $effect.pre(() => {
    user.set(data.user);
  });

  // ...and add it to the context for child components to access
  setContext('user', user);
</script>
```

```svelte
<!--- file: src/routes/user/+page.svelte --->
<script>
  import { getContext } from 'svelte';

  // Retrieve user store from context
  const user = getContext('user');
</script>

<p>Welcome {$user.name}</p>
```

Updating the value of a context-based store in deeper-level pages or components while the page is being rendered via SSR will not affect the value in the parent component because it has already been rendered by the time the store value is updated. In contrast, on the client (when CSR is enabled, which is the default) the value will be propagated and components, pages, and layouts higher in the hierarchy will react to the new value. Therefore, to avoid values 'flashing' during state updates during hydration, it is generally recommended to pass state down into components rather than up.

If you're not using SSR (and can guarantee that you won't need to use SSR in future) then you can safely keep state in a shared module, without using the context API.

## Component and page state is preserved

When you navigate around your application, SvelteKit reuses existing layout and page components. For example, if you have a route like this...

```svelte
<!--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();

  // THIS CODE IS BUGGY!
  const wordCount = data.content.split(' ').length;
  const estimatedReadingTime = wordCount / 250;
</script>

<header>
  <h1>{data.title}</h1>
  <p>Reading time: {Math.round(estimatedReadingTime)} minutes</p>
</header>

<div>{@html data.content}</div>
```

...then navigating from `/blog/my-short-post` to `/blog/my-long-post` won't cause the layout, page and any other components within to be destroyed and recreated. Instead the `data` prop (and by extension `data.title` and `data.content`) will update (as it would with any other Svelte component) and, because the code isn't rerunning, lifecycle methods like `onMount` and `onDestroy` won't rerun and `estimatedReadingTime` won't be recalculated.

Instead, we need to make the value [_reactive_](/tutorial/svelte/state):

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
<script>
  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();

+++	let wordCount = $state(data.content.split(' ').length);
  let estimatedReadingTime = $derived(wordCount / 250);+++
</script>
```

> [!NOTE] If your code in `onMount` and `onDestroy` has to run again after navigation you can use [afterNavigate]($app-navigation#afterNavigate) and [beforeNavigate]($app-navigation#beforeNavigate) respectively.

Reusing components like this means that things like sidebar scroll state are preserved, and you can easily animate between changing values. In the case that you do need to completely destroy and remount a component on navigation, you can use this pattern:

```svelte
{#key $page.url.pathname}
  <BlogPost title={data.title} content={data.title} />
{/key}
```

## Storing state in the URL

If you have state that should survive a reload and/or affect SSR, such as filters or sorting rules on a table, URL search parameters (like `?sort=price&order=ascending`) are a good place to put them. You can put them in `<a href="...">` or `<form action="...">` attributes, or set them programmatically via `goto('?key=value')`. They can be accessed inside `load` functions via the `url` parameter, and inside components via `$page.url.searchParams`.

## Storing ephemeral state in snapshots

Some UI state, such as 'is the accordion open?', is disposable — if the user navigates away or refreshes the page, it doesn't matter if the state is lost. In some cases, you _do_ want the data to persist if the user navigates to a different page and comes back, but storing the state in the URL or in a database would be overkill. For this, SvelteKit provides [snapshots](snapshots), which let you associate component state with a history entry.

# Svelte 5 Runes

## What are runes?


> [!NOTE] **rune** /ro͞on/ _noun_
>
> A letter or mark used as a mystical or magic symbol.

Runes are symbols that you use in `.svelte` and `.svelte.js`/`.svelte.ts` files to control the Svelte compiler. If you think of Svelte as a language, runes are part of the syntax — they are _keywords_.

Runes have a `$` prefix and look like functions:

```js
let message = $state('hello');
```

They differ from normal JavaScript functions in important ways, however:

- You don't need to import them — they are part of the language
- They're not values — you can't assign them to a variable or pass them as arguments to a function
- Just like JavaScript keywords, they are only valid in certain positions (the compiler will help you if you put them in the wrong place)

> [!LEGACY]
> Runes didn't exist prior to Svelte 5.

## `$state()`

The `$state` rune allows you to create _reactive state_, which means that your UI _reacts_ when it changes.

```svelte
<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>
  clicks: {count}
</button>
```

Unlike other frameworks you may have encountered, there is no API for interacting with state — `count` is just a number, rather than an object or a function, and you can update it like you would update any other variable.

### Deep state

If `$state` is used with an array or a simple object, the result is a deeply reactive _state proxy_. [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) allow Svelte to run code when you read or write properties, including via methods like `array.push(...)`, triggering granular updates.

> [!NOTE] Classes like `Set` and `Map` will not be proxied, but Svelte provides reactive implementations for various built-ins like these that can be imported from [`svelte/reactivity`](./svelte-reactivity).

State is proxified recursively until Svelte finds something other than an array or simple object. In a case like this...

```js
let todos = $state([
  {
    done: false,
    text: 'add more todos'
  }
]);
```

...modifying an individual todo's property will trigger updates to anything in your UI that depends on that specific property:

```js
// @filename: ambient.d.ts
declare global {
  const todos: Array<{ done: boolean, text: string }>
}

// @filename: index.js
// ---cut---
todos[0].done = !todos[0].done;
```

If you push a new object to the array, it will also be proxified:

```js
// @filename: ambient.d.ts
declare global {
  const todos: Array<{ done: boolean, text: string }>
}

// @filename: index.js
// ---cut---
todos.push({
  done: false,
  text: 'eat lunch'
});
```

> [!NOTE] When you update properties of proxies, the original object is _not_ mutated.

### Classes

You can also use `$state` in class fields (whether public or private):

```js
// @errors: 7006 2554
class Todo {
  done = $state(false);
  text = $state();

  constructor(text) {
    this.text = text;
  }

  reset() {
    this.text = '';
    this.done = false;
  }
}
```

> [!NOTE] The compiler transforms `done` and `text` into `get`/`set` methods on the class prototype referencing private fields.

## `$state.raw`

In cases where you don't want objects and arrays to be deeply reactive you can use `$state.raw`.

State declared with `$state.raw` cannot be mutated; it can only be _reassigned_. In other words, rather than assigning to a property of an object, or using an array method like `push`, replace the object or array altogether if you'd like to update it:

```js
let person = $state.raw({
  name: 'Heraclitus',
  age: 49
});

// this will have no effect
person.age += 1;

// this will work, because we're creating a new person
person = {
  name: 'Heraclitus',
  age: 50
};
```

This can improve performance with large arrays and objects that you weren't planning to mutate anyway, since it avoids the cost of making them reactive. Note that raw state can _contain_ reactive state (for example, a raw array of reactive objects).

## `$state.snapshot`

To take a static snapshot of a deeply reactive `$state` proxy, use `$state.snapshot`:

```svelte
<script>
  let counter = $state({ count: 0 });

  function onclick() {
    // Will log `{ count: ... }` rather than `Proxy { ... }`
    console.log($state.snapshot(counter));
  }
</script>
```

This is handy when you want to pass some state to an external library or API that doesn't expect a proxy, such as `structuredClone`.

## `$derived()


Derived state is declared with the `$derived` rune:

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
  {doubled}
</button>

<p>{count} doubled is {doubled}</p>
```

The expression inside `$derived(...)` should be free of side-effects. Svelte will disallow state changes (e.g. `count++`) inside derived expressions.

As with `$state`, you can mark class fields as `$derived`.

> [!NOTE] Code in Svelte components is only executed once at creation, without the `$derived` rune `double` would maintain it's original value.

## `$derived.by`

Sometimes you need to create complex derivations that don't fit inside a short expression. In these cases, you can use `$derived.by` which accepts a function as its argument.

```svelte
<script>
  let numbers = $state([1, 2, 3]);
  let total = $derived.by(() => {
    let total = 0;
    for (const n of numbers) {
      total += n;
    }
    return total;
  });
</script>

<button onclick={() => numbers.push(numbers.length + 1)}>
  {numbers.join(' + ')} = {total}
</button>
```

In essence, `$derived(expression)` is equivalent to `$derived.by(() => expression)`.

## `$effect()


Effects are what make your application _do things_. When Svelte runs an effect function, it tracks which pieces of state (and derived state) are accessed, and re-runs the function when that state later changes.

Most of the effects in a Svelte app are created by Svelte itself — they're the bits that update the text in `<h1>hello {name}!</h1>` when `name` changes, for example.

But you can also create your own effects with the `$effect` rune, which is useful when you need to synchronize an external system (whether that's a library, or a `<canvas>` element, or something across a network) with state inside your Svelte app.

> [!NOTE] Avoid overusing effects! When you do too much work in them, code often becomes difficult to understand and maintain. See [when not to use effects](#When-not-to-use-effects) to learn about alternative approaches.

Your effects run after the component has been mounted to the DOM, and in a [microtask](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) after state changes ([demo](/playground/untitled#H4sIAAAAAAAAE31S246bMBD9lZF3pSRSAqTVvrCAVPUP2sdSKY4ZwJJjkD0hSVH-vbINuWxXfQH5zMyZc2ZmZLVUaFn6a2R06ZGlHmBrpvnBvb71fWQHVOSwPbf4GS46TajJspRlVhjZU1HqkhQSWPkHIYdXS5xw-Zas3ueI6FRn7qHFS11_xSRZhIxbFtcDtw7SJb1iXaOg5XIFeQGjzyPRaevYNOGZIJ8qogbpe8CWiy_VzEpTXiQUcvPDkSVrSNZz1UlW1N5eLcqmpdXUvaQ4BmqlhZNUCgxuzFHDqUWNAxrYeUM76AzsnOsdiJbrBp_71lKpn3RRbii-4P3f-IMsRxS-wcDV_bL4PmSdBa2wl7pKnbp8DMgVvJm8ZNskKRkEM_OzyOKQFkgqOYBQ3Nq89Ns0nbIl81vMFN-jKoLMTOr-SOBOJS-Z8f5Y6D1wdcR8dFqvEBdetK-PHwj-z-cH8oHPY54wRJ8Ys7iSQ3Bg3VA9azQbmC9k35kKzYa6PoVtfwbbKVnBixBiGn7Pq0rqJoUtHiCZwAM3jdTPWCVtr_glhVrhecIa3vuksJ_b7TqFs4DPyriSjd5IwoNNQaAmNI-ESfR2p8zimzvN1swdCkvJHPH6-_oX8o1SgcIDAAA=)):

```svelte
<script>
  let size = $state(50);
  let color = $state('#ff3e00');

  let canvas;

  $effect(() => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // this will re-run whenever `color` or `size` change
    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
  });
</script>

<canvas bind:this={canvas} width="100" height="100" />
```

Re-runs are batched (i.e. changing `color` and `size` in the same moment won't cause two separate runs), and happen after any DOM updates have been applied.

You can place `$effect` anywhere, not just at the top level of a component, as long as it is called during component initialization (or while a parent effect is active). It is then tied to the lifecycle of the component (or parent effect) and will therefore destroy itself when the component unmounts (or the parent effect is destroyed).

You can return a function from `$effect`, which will run immediately before the effect re-runs, and before it is destroyed ([demo](/playground/untitled#H4sIAAAAAAAAE42RQY-bMBCF_8rI2kPopiXpMQtIPfbeW6m0xjyKtWaM7CFphPjvFVB2k2oPe7LmzXzyezOjaqxDVKefo5JrD3VaBLVXrLu5-tb3X-IZTmat0hHv6cazgCWqk8qiCbaXouRSHISMH1gop4coWrA7JE9bp7PO2QjjuY5vA8fDYZ3hUh7QNDCy2yWUFzTOUilpSj9aG-linaMKFGACtKCmSwvGGYGeLQvCWbtnMq3m34grajxHoa1JOUXI93_V_Sfz7Oz7Mafj0ypN-zvHm8dSAmQITP_xaUq2IU1GO1dp80I2Uh_82dao92Rl9R8GvgF0QrbrUFstcFeq0PgAkha0LoICPoeB4w1SJUvsZcj4rvcMlvmvGlGCv6J-DeSgw2vabQnJlm55p7nM0rcTctYei3HZxZSl7XHVqkHEM3k2zpqXfFyj393zU05fpyI6f0HI0hUoPoamC9roKDeo2ivBH1EnCQOmX9NfYw2GHrgCAAA=)).

```svelte
<script>
  let count = $state(0);
  let milliseconds = $state(1000);

  $effect(() => {
    // This will be recreated whenever `milliseconds` changes
    const interval = setInterval(() => {
      count += 1;
    }, milliseconds);

    return () => {
      // if a callback is provided, it will run
      // a) immediately before the effect re-runs
      // b) when the component is destroyed
      clearInterval(interval);
    };
  });
</script>

<h1>{count}</h1>

<button onclick={() => (milliseconds *= 2)}>slower</button>
<button onclick={() => (milliseconds /= 2)}>faster</button>
```

### Understanding dependencies

`$effect` automatically picks up any reactive values (`$state`, `$derived`, `$props`) that are _synchronously_ read inside its function body and registers them as dependencies. When those dependencies change, the `$effect` schedules a rerun.

Values that are read _asynchronously_ — after an `await` or inside a `setTimeout`, for example — will not be tracked. Here, the canvas will be repainted when `color` changes, but not when `size` changes ([demo](/playground/untitled#H4sIAAAAAAAAE31T246bMBD9lZF3pWSlBEirfaEQqdo_2PatVIpjBrDkGGQPJGnEv1e2IZfVal-wfHzmzJyZ4cIqqdCy9M-F0blDlnqArZjmB3f72XWRHVCRw_bc4me4aDWhJstSlllhZEfbQhekkMDKfwg5PFvihMvX5OXH_CJa1Zrb0-Kpqr5jkiwC48rieuDWQbqgZ6wqFLRcvkC-hYvnkWi1dWqa8ESQTxFRjfQWsOXiWzmr0sSLhEJu3p1YsoJkNUcdZUnN9dagrBu6FVRQHAM10sJRKgUG16bXcGxQ44AGdt7SDkTDdY02iqLHnJVU6hedlWuIp94JW6Tf8oBt_8GdTxlF0b4n0C35ZLBzXb3mmYn3ae6cOW74zj0YVzDNYXRHFt9mprNgHfZSl6mzml8CMoLvTV6wTZIUDEJv5us2iwMtiJRyAKG4tXnhl8O0yhbML0Wm-B7VNlSSSd31BG7z8oIZZ6dgIffAVY_5xdU9Qrz1Bnx8fCfwtZ7v8Qc9j3nB8PqgmMWlHIID6-bkVaPZwDySfWtKNGtquxQ23Qlsq2QJT0KIqb8dL0up6xQ2eIBkAg_c1FI_YqW0neLnFCqFpwmreedJYT7XX8FVOBfwWRhXstZrSXiwKQjUhOZeMIleb5JZfHWn2Yq5pWEpmR7Hv-N_wEqT8hEEAAA=)):

```ts
// @filename: index.ts
declare let canvas: {
  width: number;
  height: number;
  getContext(type: '2d', options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D;
};
declare let color: string;
declare let size: number;

// ---cut---
$effect(() => {
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  // this will re-run whenever `color` changes...
  context.fillStyle = color;

  setTimeout(() => {
    // ...but not when `size` changes
    context.fillRect(0, 0, size, size);
  }, 0);
});
```

An effect only reruns when the object it reads changes, not when a property inside it changes. (If you want to observe changes _inside_ an object at dev time, you can use [`$inspect`]($inspect).)

```svelte
<script>
  let state = $state({ value: 0 });
  let derived = $derived({ value: state.value * 2 });

  // this will run once, because `state` is never reassigned (only mutated)
  $effect(() => {
    state;
  });

  // this will run whenever `state.value` changes...
  $effect(() => {
    state.value;
  });

  // ...and so will this, because `derived` is a new object each time
  $effect(() => {
    derived;
  });
</script>

<button onclick={() => (state.value += 1)}>
  {state.value}
</button>

<p>{state.value} doubled is {derived.value}</p>
```

An effect only depends on the values that it read the last time it ran. If `a` is true, changes to `b` will [not cause this effect to rerun](/playground/untitled#H4sIAAAAAAAAE3WQ0WrDMAxFf0U1hTow1vcsMfQ7lj3YjlxEXTvEymC4_vfFC6Ewtidxde8RkrJw5DGJ9j2LoO8oWnGZJvEi-GuqIn2iZ1x1istsa6dLdqaJ1RAG9sigoYdjYs0onfYJm7fdMX85q3dE59CylA30CnJtDWxjSNHjq49XeZqXEChcT9usLUAOpIbHA0yzM78oColGhDVofLS3neZSS6mqOz-XD51ZmGOAGKwne-vztk-956CL0kAJsi7decupf4l658EUZX4I8yTWt93jSI5wFC3PC5aP8g0Aje5DcQEAAA==):

```ts
let a = false;
let b = false;
// ---cut---
$effect(() => {
  console.log('running');

  if (a || b) {
    console.log('inside if block');
  }
});
```

## `$effect.pre`

In rare cases, you may need to run code _before_ the DOM updates. For this we can use the `$effect.pre` rune:

```svelte
<script>
  import { tick } from 'svelte';

  let div = $state();
  let messages = $state([]);

  // ...

  $effect.pre(() => {
    if (!div) return; // not yet mounted

    // reference `messages` array length so that this code re-runs whenever it changes
    messages.length;

    // autoscroll when new messages are added
    if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
      tick().then(() => {
        div.scrollTo(0, div.scrollHeight);
      });
    }
  });
</script>

<div bind:this={div}>
  {#each messages as message}
    <p>{message}</p>
  {/each}
</div>
```

Apart from the timing, `$effect.pre` works exactly like `$effect`.

## `$effect.tracking`

The `$effect.tracking` rune is an advanced feature that tells you whether or not the code is running inside a tracking context, such as an effect or inside your template ([demo](/playground/untitled#H4sIAAAAAAAACn3PwYrCMBDG8VeZDYIt2PYeY8Dn2HrIhqkU08nQjItS-u6buAt7UDzmz8ePyaKGMWBS-nNRcmdU-hHUTpGbyuvI3KZvDFLal0v4qvtIgiSZUSb5eWSxPfWSc4oB2xDP1XYk8HHiSHkICeXKeruDDQ4Demlldv4y0rmq6z10HQwuJMxGVv4mVVXDwcJS0jP9u3knynwtoKz1vifT_Z9Jhm0WBCcOTlDD8kyspmML5qNpHg40jc3fFryJ0iWsp_UHgz3180oBAAA=)):

```svelte
<script>
  console.log('in component setup:', $effect.tracking()); // false

  $effect(() => {
    console.log('in effect:', $effect.tracking()); // true
  });
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```

This allows you to (for example) add things like subscriptions without causing memory leaks, by putting them in child effects. Here's a `readable` function that listens to changes from a callback function as long as it's inside a tracking context:

```ts
import { tick } from 'svelte';

export default function readable<T>(
  initial_value: T,
  start: (callback: (update: (v: T) => T) => T) => () => void
) {
  let value = $state(initial_value);

  let subscribers = 0;
  let stop: null | (() => void) = null;

  return {
    get value() {
      // If in a tracking context ...
      if ($effect.tracking()) {
        $effect(() => {
          // ...and there's no subscribers yet...
          if (subscribers === 0) {
            // ...invoke the function and listen to changes to update state
            stop = start((fn) => (value = fn(value)));
          }

          subscribers++;

          // The return callback is called once a listener unlistens
          return () => {
            tick().then(() => {
              subscribers--;
              // If it was the last subscriber...
              if (subscribers === 0) {
                // ...stop listening to changes
                stop?.();
                stop = null;
              }
            });
          };
        });
      }

      return value;
    }
  };
}
```

## `$effect.root`

The `$effect.root` rune is an advanced feature that creates a non-tracked scope that doesn't auto-cleanup. This is useful for
nested effects that you want to manually control. This rune also allows for creation of effects outside of the component initialisation phase.

```svelte
<script>
  let count = $state(0);

  const cleanup = $effect.root(() => {
    $effect(() => {
      console.log(count);
    });

    return () => {
      console.log('effect root cleanup');
    };
  });
</script>
```

## When not to use effects

In general, `$effect` is best considered something of an escape hatch — useful for things like analytics and direct DOM manipulation — rather than a tool you should use frequently. In particular, avoid using it to synchronise state. Instead of this...

```svelte
<script>
  let count = $state(0);
  let doubled = $state();

  // don't do this!
  $effect(() => {
    doubled = count * 2;
  });
</script>
```

...do this:

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
```

> [!NOTE] For things that are more complicated than a simple expression like `count * 2`, you can also use `$derived.by`.

You might be tempted to do something convoluted with effects to link one value to another. The following example shows two inputs for "money spent" and "money left" that are connected to each other. If you update one, the other should update accordingly. Don't use effects for this ([demo](/playground/untitled#H4sIAAAAAAAACpVRy2rDMBD8lWXJwYE0dg-9KFYg31H3oNirIJBlYa1DjPG_F8l1XEop9LgzOzP7mFAbSwHF-4ROtYQCL97jAXn0sQh3skx4wNANfR2RMtS98XyuXMWWGLhjZUHCa1GcVix4cgwSdoEVU1bsn4wl_Y1I2kS6inekNdWcZXuQZ5giFDWpfwl5WYyT2fynbB1g1UWbTVbm2w6utOpKNq1TGucHhri6rLBX7kYVwtW4RtyVHUhOyXeGVj3klLxnyJP0i8lXNJUx6en-v6A48K85kTimpi0sYj-yAo-Wlh9FcL1LY4K3ahSgLT1OC3ZTXkBxfKN2uVC6T5LjAduuMdpQg4L7geaP-RNHPuClMQIAAA==)):

```svelte
<script>
  let total = 100;
  let spent = $state(0);
  let left = $state(total);

  $effect(() => {
    left = total - spent;
  });

  $effect(() => {
    spent = total - left;
  });
</script>

<label>
  <input type="range" bind:value={spent} max={total} />
  {spent}/{total} spent
</label>

<label>
  <input type="range" bind:value={left} max={total} />
  {left}/{total} left
</label>
```

Instead, use callbacks where possible ([demo](/playground/untitled#H4sIAAAAAAAACo2SP2-DMBDFv8rp1CFR84cOXQhU6p6tY-ngwoEsGWPhI0pk8d0rG5yglqGj37v7veMJh7VUZDH9dKhFS5jiuzG4Q74Z_7AXUky4Q9sNfemVzJa9NPxW6IIVMXDHQkEOL0lyipo1pBlyeLIsmDbJ9u4oqhdG2A2mLrgedMmy0zCYSjB9eMaGtuC8WXBkPtOBRd8QHy5CDXSa3Jk7HbOfDgjWuAo_U71kz9vr6Bgc2X44orPjow2dKfFNKhSTSW0GBl9iXmAvdEMFQqDmLgBH6HQYyt3ie0doxTV3IWqEY2DN88eohqePvsf9O9mf_if4HMSVXD89NfEI99qvbMs3RdPv4MXYaSWtUeKWQq3oOlfZCJNCcnildlFgWMcdtl0la0kVptwPNH6NP_uzV0acAgAA)):

```svelte
<script>
  let total = 100;
  let spent = $state(0);
  let left = $state(total);

  function updateSpent(e) {
    spent = +e.target.value;
    left = total - spent;
  }

  function updateLeft(e) {
    left = +e.target.value;
    spent = total - left;
  }
</script>

<label>
  <input type="range" value={spent} oninput={updateSpent} max={total} />
  {spent}/{total} spent
</label>

<label>
  <input type="range" value={left} oninput={updateLeft} max={total} />
  {left}/{total} left
</label>
```

If you need to use bindings, for whatever reason (for example when you want some kind of "writable `$derived`"), consider using getters and setters to synchronise state ([demo](/playground/untitled#H4sIAAAAAAAACo2SQW-DMAyF_4pl7dBqXcsOu1CYtHtvO44dsmKqSCFExFRFiP8-xRCGth52tJ_9PecpA1bakMf0Y0CrasIU35zDHXLvQuGvZJhwh77p2nPoZP7casevhS3YEAM3rAzk8Jwkx9jzjixDDg-eFdMm2S6KoWolyK6ItuCqs2fWjYXOlYrpPTA2tIUhiAVH5iPtWbUX4v1VmY6Okzpzp2OepgNEGu_CT1St2fP2fXQ0juwwHNHZ4ScNmxn1RUaCybR1HUMIMS-wVfZCBYJQ80GAIzRWhvJh9d4RanXLB7Ea4SCsef4Qu1IG68Xu387h9D_GJ2ne8ZXpxTZUv1w994amjxCaMc1Se2dUn0Jl6DaHeFEuhWT_QvUqOlnHHdZNqStNJabcdjR-jt8IbC-7lgIAAA==)):

```svelte
<script>
  let total = 100;
  let spent = $state(0);

  let left = {
    get value() {
      return total - spent;
    },
    set value(v) {
      spent = total - v;
    }
  };
</script>

<label>
  <input type="range" bind:value={spent} max={total} />
  {spent}/{total} spent
</label>

<label>
  <input type="range" bind:value={left.value} max={total} />
  {left.value}/{total} left
</label>
```

If you absolutely have to update `$state` within an effect and run into an infinite loop because you read and write to the same `$state`, use [untrack](svelte#untrack).

## `$props()`


The inputs to a component are referred to as _props_, which is short for _properties_. You pass props to components just like you pass attributes to elements:

```svelte
<script>
  import MyComponent from './MyComponent.svelte';
</script>

/// file: App.svelte
<MyComponent adjective="cool" />
```

On the other side, inside `MyComponent.svelte`, we can receive props with the `$props` rune...

```svelte
<script>
  let props = $props();
</script>

/// file: MyComponent.svelte
<p>this component is {props.adjective}</p>
```

...though more commonly, you'll [_destructure_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) your props:

```svelte
/// file: MyComponent.svelte
<script>
  let +++{ adjective }+++ = $props();
</script>

<p>this component is {+++adjective+++}</p>
```

## Fallback values

Destructuring allows us to declare fallback values, which are used if the parent component does not set a given prop:

```js
/// file: MyComponent.svelte
let { adjective = 'happy' } = $props();
```

> [!NOTE] Fallback values are not turned into reactive state proxies.

## Renaming props

We can also use the destructuring assignment to rename props, which is necessary if they're invalid identifiers, or a JavaScript keyword like `super`:

```js
let { super: trouper = 'lights are gonna find me' } = $props();
```

## Rest props

Finally, we can use a _rest property_ to get, well, the rest of the props:

```js
let { a, b, c, ...others } = $props();
```

## Updating props

References to a prop inside a component update when the prop itself updates — when `count` changes in `App.svelte`, it will also change inside `Child.svelte`. But the child component is able to temporarily override the prop value, which can be useful for unsaved ephemeral state ([demo](/playground/untitled#H4sIAAAAAAAAE6WQ0WrDMAxFf0WIQR0Wmu3VTQJln7HsIfVcZubIxlbGRvC_DzuBraN92qPula50tODZWB1RPi_IX16jLALWSOOUq6P3-_ihLWftNEZ9TVeOWBNHlNhGFYznfqCBzeRdYHh6M_YVzsFNsNs3pdpGd4eBcqPVDMrNxNDBXeSRtXioDgO1zU8ataeZ2RE4Utao924RFXQ9iHXwvoPHKpW1xY4g_Bg0cSVhKS0p560Za95612ZC02ONrD8ZJYdZp_rGQ37ff_mSP86Np2TWZaNNmdcH56P4P67K66_SXoK9pG-5dF5Z9QEAAA==)):

<!-- prettier-ignore -->
```svelte
/// file: App.svelte
<script>
  import Child from './Child.svelte';

  let count = $state(0);
</script>

<button onclick={() => (count += 1)}>
  clicks (parent): {count}
</button>

<Child {count} />
```

<!-- prettier-ignore -->
```svelte
/// file: Child.svelte
<script>
  let { count } = $props();
</script>

<button onclick={() => (count += 1)}>
  clicks (child): {count}
</button>
```

## Type safety

You can add type safety to your components by annotating your props, as you would with any other variable declaration. In TypeScript that might look like this...

```svelte
<script lang="ts">
  let { adjective }: { adjective: string } = $props();
</script>
```

...while in JSDoc you can do this:

```svelte
<script>
  /** @type {{ adjective: string }} */
  let { adjective } = $props();
</script>
```

You can, of course, separate the type declaration from the annotation:

```svelte
<script lang="ts">
  interface Props {
    adjective: string;
  }

  let { adjective }: Props = $props();
</script>
```

Adding types is recommended, as it ensures that people using your component can easily discover which props they should provide.

## `$bindable()`

Ordinarily, props go one way, from parent to child. This makes it easy to understand how data flows around your app.

In Svelte, component props can be _bound_, which means that data can also flow _up_ from child to parent. This isn't something you should do often, but it can simplify your code if used sparingly and carefully.

It also means that a state proxy can be _mutated_ in the child.

> [!NOTE] Mutation is also possible with normal props, but is strongly discouraged — Svelte will warn you if it detects that a component is mutating state it does not 'own'.

To mark a prop as bindable, we use the `$bindable` rune:

<!-- prettier-ignore -->
```svelte
/// file: FancyInput.svelte
<script>
  let { value = $bindable(), ...props } = $props();
</script>

<input bind:value={value} {...props} />

<style>
  input {
    font-family: 'Comic Sans MS';
    color: deeppink;
  }
</style>
```

Now, a component that uses `<FancyInput>` can add the [`bind:`](bind) directive ([demo](/playground/untitled#H4sIAAAAAAAAE3WQwWrDMBBEf2URBSfg2nfFMZRCoYeecqx6UJx1IyqvhLUONcb_XqSkTUOSk1az7DBvJtEai0HI90nw6FHIJIhckO7i78n7IhzQctS2OuAtvXHESByEFFVoeuO5VqTYdN71DC-amvGV_MDQ9q6DrCjP0skkWymKJxYZOgxBfyKs4SGwZlxke7TWZcuVoqo8-1P1z3lraCcP2g64nk4GM5S1osrXf0JV-lrkgvGbheR-wDm_g30V8JL-1vpOCZFogpQsEsWcemtxscyhKArfOx9gjps0Lq4hzRVfemaYfu-PoIqqwKPFY_XpaIqj4tYRP7a6M3aUkD27zjSw0RTgbZN6Z8WNs66XsEP03tBXUueUJFlelvYx_wCuI3leNwIAAA==)):

<!-- prettier-ignore -->
```svelte
/// App.svelte
<script>
  import FancyInput from './FancyInput.svelte';

  let message = $state('hello');
</script>

<FancyInput bind:value={message} />
<p>{message}</p>
```

The parent component doesn't _have_ to use `bind:` — it can just pass a normal prop. Some parents don't want to listen to what their children have to say.

In this case, you can specify a fallback value for when no prop is passed at all:

```js
/// file: FancyInput.svelte
let { value = $bindable('fallback'), ...props } = $props();
```

## `$inspect()`

The `$inspect` rune is roughly equivalent to `console.log`, with the exception that it will re-run whenever its argument changes. `$inspect` tracks reactive state deeply, meaning that updating something inside an object or array using fine-grained reactivity will cause it to re-fire ([demo](/playground/untitled#H4sIAAAAAAAACkWQ0YqDQAxFfyUMhSotdZ-tCvu431AXtGOqQ2NmmMm0LOK_r7Utfby5JzeXTOpiCIPKT5PidkSVq2_n1F7Jn3uIcEMSXHSw0evHpAjaGydVzbUQCmgbWaCETZBWMPlKj29nxBDaHj_edkAiu12JhdkYDg61JGvE_s2nR8gyuBuiJZuDJTyQ7eE-IEOzog1YD80Lb0APLfdYc5F9qnFxjiKWwbImo6_llKRQVs-2u91c_bD2OCJLkT3JZasw7KLA2XCX31qKWE6vIzNk1fKE0XbmYrBTufiI8-_8D2cUWBA_AQAA)):

```svelte
<script>
  let count = $state(0);
  let message = $state('hello');

  $inspect(count, message); // will console.log when `count` or `message` change
</script>

<button onclick={() => count++}>Increment</button>
<input bind:value={message} />
```

## $inspect(...).with

`$inspect` returns a property `with`, which you can invoke with a callback, which will then be invoked instead of `console.log`. The first argument to the callback is either `"init"` or `"update"`; subsequent arguments are the values passed to `$inspect` ([demo](/playground/untitled#H4sIAAAAAAAACkVQ24qDMBD9lSEUqlTqPlsj7ON-w7pQG8c2VCchmVSK-O-bKMs-DefKYRYx6BG9qL4XQd2EohKf1opC8Nsm4F84MkbsTXAqMbVXTltuWmp5RAZlAjFIOHjuGLOP_BKVqB00eYuKs82Qn2fNjyxLtcWeyUE2sCRry3qATQIpJRyD7WPVMf9TW-7xFu53dBcoSzAOrsqQNyOe2XUKr0Xi5kcMvdDB2wSYO-I9vKazplV1-T-d6ltgNgSG1KjVUy7ZtmdbdjqtzRcphxMS1-XubOITJtPrQWMvKnYB15_1F7KKadA_AQAA)):

```svelte
<script>
  let count = $state(0);

  $inspect(count).with((type, count) => {
    if (type === 'update') {
      debugger; // or `console.trace`, or whatever you want
    }
  });
</script>

<button onclick={() => count++}>Increment</button>
```

A convenient way to find the origin of some change is to pass `console.trace` to `with`:

```js
// @errors: 2304
$inspect(stuff).with(console.trace);
```

> [!NOTE] `$inspect` only works during development. In a production build it becomes a noop.


## `$host()`

When compiling a component as a custom element, the `$host` rune provides access to the host element, allowing you to (for example) dispatch custom events ([demo](/playground/untitled#H4sIAAAAAAAAE41Ry2rDMBD8FSECtqkTt1fHFpSSL-ix7sFRNkTEXglrnTYY_3uRlDgxTaEHIfYxs7szA9-rBizPPwZOZwM89wmecqxbF70as7InaMjltrWFR3mpkQDJ8pwXVnbKkKiwItUa3RGLVtk7gTHQXRDR2lXda4CY1D0SK9nCUk0QPyfrCovsRoNFe17aQOAwGncgO2gBqRzihJXiQrEs2csYOhQ-7HgKHaLIbpRhhBG-I2eD_8ciM4KnnOCbeE5dD2P6h0Dz0-Yi_arNhPLJXBtSGi2TvSXdbpqwdsXvjuYsC1veabvvUTog2ylrapKH2G2XsMFLS4uDthQnq2t1cwKkGOGLvYU5PvaQxLsxOkPmsm97Io1Mo2yUPF6VnOZFkw1RMoopKLKAE_9gmGxyDFMwMcwN-Bx_ABXQWmOtAgAA)):

<!-- prettier-ignore -->
```svelte
/// file: Stepper.svelte
<svelte:options customElement="my-stepper" />

<script>
  function dispatch(type) {
    +++$host()+++.dispatchEvent(new CustomEvent(type));
  }
</script>

<button onclick={() => dispatch('decrement')}>decrement</button>
<button onclick={() => dispatch('increment')}>increment</button>
```

<!-- prettier-ignore -->
```svelte
/// file: App.svelte
<script>
  import './Stepper.svelte';

  let count = $state(0);
</script>

<my-stepper
  ondecrement={() => count -= 1}
  onincrement={() => count += 1}
></my-stepper>

<p>count: {count}</p>
```
# template syntax

## Basic markup

Markup inside a Svelte component can be thought of as HTML++.

## Tags

A lowercase tag, like `<div>`, denotes a regular HTML element. A capitalised tag or a tag that uses dot notation, such as `<Widget>` or `<my.stuff>`, indicates a _component_.

```svelte
<script>
  import Widget from './Widget.svelte';
</script>

<div>
  <Widget />
</div>
```

## Element attributes

By default, attributes work exactly like their HTML counterparts.

```svelte
<div class="foo">
  <button disabled>can't touch this</button>
</div>
```

As in HTML, values may be unquoted.

<!-- prettier-ignore -->
```svelte
<input type=checkbox />
```

Attribute values can contain JavaScript expressions.

```svelte
<a href="page/{p}">page {p}</a>
```

Or they can _be_ JavaScript expressions.

```svelte
<button disabled={!clickable}>...</button>
```

Boolean attributes are included on the element if their value is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) and excluded if it's [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy).

All other attributes are included unless their value is [nullish](https://developer.mozilla.org/en-US/docs/Glossary/Nullish) (`null` or `undefined`).

```svelte
<input required={false} placeholder="This input field is not required" />
<div title={null}>This div has no title attribute</div>
```

> [!NOTE] Quoting a singular expression does not affect how the value is parsed, but in Svelte 6 it will cause the value to be coerced to a string:
>
> <!-- prettier-ignore -->
> ```svelte
> <button disabled="{number !== 42}">...</button>
> ```

When the attribute name and value match (`name={name}`), they can be replaced with `{name}`.

```svelte
<button {disabled}>...</button>
<!-- equivalent to
<button disabled={disabled}>...</button>
-->
```

## Component props

By convention, values passed to components are referred to as _properties_ or _props_ rather than _attributes_, which are a feature of the DOM.

As with elements, `name={name}` can be replaced with the `{name}` shorthand.

```svelte
<Widget foo={bar} answer={42} text="hello" />
```

_Spread attributes_ allow many attributes or properties to be passed to an element or component at once.

An element or component can have multiple spread attributes, interspersed with regular ones.

```svelte
<Widget {...things} />
```

## Events

Listening to DOM events is possible by adding attributes to the element that start with `on`. For example, to listen to the `click` event, add the `onclick` attribute to a button:

```svelte
<button onclick={() => console.log('clicked')}>click me</button>
```

Event attributes are case sensitive. `onclick` listens to the `click` event, `onClick` listens to the `Click` event, which is different. This ensures you can listen to custom events that have uppercase characters in them.

Because events are just attributes, the same rules as for attributes apply:

- you can use the shorthand form: `<button {onclick}>click me</button>`
- you can spread them: `<button {...thisSpreadContainsEventAttributes}>click me</button>`

Timing-wise, event attributes always fire after events from bindings (e.g. `oninput` always fires after an update to `bind:value`). Under the hood, some event handlers are attached directly with `addEventListener`, while others are _delegated_.

When using `ontouchstart` and `ontouchmove` event attributes, the handlers are [passive](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners) for better performance. This greatly improves responsiveness by allowing the browser to scroll the document immediately, rather than waiting to see if the event handler calls `event.preventDefault()`.

In the very rare cases that you need to prevent these event defaults, you should use [`on`](https://svelte-5-preview.vercel.app/docs/imports#svelte-events) instead (for example inside an action).

### Event delegation

To reduce memory footprint and increase performance, Svelte uses a technique called event delegation. This means that for certain events — see the list below — a single event listener at the application root takes responsibility for running any handlers on the event's path.

There are a few gotchas to be aware of:

- when you manually dispatch an event with a delegated listener, make sure to set the `{ bubbles: true }` option or it won't reach the application root
- when using `addEventListener` directly, avoid calling `stopPropagation` or the event won't reach the application root and handlers won't be invoked. Similarly, handlers added manually inside the application root will run _before_ handlers added declaratively deeper in the DOM (with e.g. `onclick={...}`), in both capturing and bubbling phases. For these reasons it's better to use the `on` function imported from `svelte/events` rather than `addEventListener`, as it will ensure that order is preserved and `stopPropagation` is handled correctly.

The following event handlers are delegated:

- `beforeinput`
- `click`
- `change`
- `dblclick`
- `contextmenu`
- `focusin`
- `focusout`
- `input`
- `keydown`
- `keyup`
- `mousedown`
- `mousemove`
- `mouseout`
- `mouseover`
- `mouseup`
- `pointerdown`
- `pointermove`
- `pointerout`
- `pointerover`
- `pointerup`
- `touchend`
- `touchmove`
- `touchstart`

## Text expressions

A JavaScript expression can be included as text by surrounding it with curly braces.

```svelte
{expression}
```

Curly braces can be included in a Svelte template by using their [HTML entity](https://developer.mozilla.org/docs/Glossary/Entity) strings: `&lbrace;`, `&lcub;`, or `&#123;` for `{` and `&rbrace;`, `&rcub;`, or `&#125;` for `}`.

If you're using a regular expression (`RegExp`) [literal notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#literal_notation_and_constructor), you'll need to wrap it in parentheses.

<!-- prettier-ignore -->
```svelte
<h1>Hello {name}!</h1>
<p>{a} + {b} = {a + b}.</p>

<div>{(/^[A-Za-z ]+$/).test(value) ? x : y}</div>
```

The expression will be stringified and escaped to prevent code injections. If you want to render HTML, use the `{@html}` tag instead.

```svelte
{@html potentiallyUnsafeHtmlString}
```

> [!NOTE] Make sure that you either escape the passed string or only populate it with values that are under your control in order to prevent [XSS attacks](https://owasp.org/www-community/attacks/xss/)

## Comments

You can use HTML comments inside components.

```svelte
<!-- this is a comment! --><h1>Hello world</h1>
```

Comments beginning with `svelte-ignore` disable warnings for the next block of markup. Usually, these are accessibility warnings; make sure that you're disabling them for a good reason.

```svelte
<!-- svelte-ignore a11y-autofocus -->
<input bind:value={name} autofocus />
```

You can add a special comment starting with `@component` that will show up when hovering over the component name in other files.

````svelte
<!--
@component
- You can use markdown here.
- You can also use code blocks here.
- Usage:
  ```html
  <Main name="Arethra">
  ```
-->
<script>
  let { name } = $props();
</script>

<main>
  <h1>
    Hello, {name}
  </h1>
</main>
````

## `{#if ...}` blocks

```svelte
<!--- copy: false  --->
{#if expression}...{/if}
```

```svelte
<!--- copy: false  --->
{#if expression}...{:else if expression}...{/if}
```

```svelte
<!--- copy: false  --->
{#if expression}...{:else}...{/if}
```

Content that is conditionally rendered can be wrapped in an if block.

```svelte
{#if answer === 42}
  <p>what was the question?</p>
{/if}
```

Additional conditions can be added with `{:else if expression}`, optionally ending in an `{:else}` clause.

```svelte
{#if porridge.temperature > 100}
  <p>too hot!</p>
{:else if 80 > porridge.temperature}
  <p>too cold!</p>
{:else}
  <p>just right!</p>
{/if}
```

(Blocks don't have to wrap elements, they can also wrap text within elements.)

## `{#each ...}` blocks


```svelte
<!--- copy: false  --->
{#each expression as name}...{/each}
```

```svelte
<!--- copy: false  --->
{#each expression as name, index}...{/each}
```

Iterating over values can be done with an each block. The values in question can be arrays, array-like objects (i.e. anything with a `length` property), or iterables like `Map` and `Set` — in other words, anything that can be used with `Array.from`.

```svelte
<h1>Shopping list</h1>
<ul>
  {#each items as item}
    <li>{item.name} x {item.qty}</li>
  {/each}
</ul>
```

You can use each blocks to iterate over any array or array-like value — that is, any object with a `length` property.

An each block can also specify an _index_, equivalent to the second argument in an `array.map(...)` callback:

```svelte
{#each items as item, i}
  <li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

## Keyed each blocks

```svelte
<!--- copy: false  --->
{#each expression as name (key)}...{/each}
```

```svelte
<!--- copy: false  --->
{#each expression as name, index (key)}...{/each}
```

If a _key_ expression is provided — which must uniquely identify each list item — Svelte will use it to diff the list when data changes, rather than adding or removing items at the end. The key can be any object, but strings and numbers are recommended since they allow identity to persist when the objects themselves change.

```svelte
{#each items as item (item.id)}
  <li>{item.name} x {item.qty}</li>
{/each}

<!-- or with additional index value -->
{#each items as item, i (item.id)}
  <li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

You can freely use destructuring and rest patterns in each blocks.

```svelte
{#each items as { id, name, qty }, i (id)}
  <li>{i + 1}: {name} x {qty}</li>
{/each}

{#each objects as { id, ...rest }}
  <li><span>{id}</span><MyComponent {...rest} /></li>
{/each}

{#each items as [id, ...rest]}
  <li><span>{id}</span><MyComponent values={rest} /></li>
{/each}
```

## Else blocks

```svelte
<!--- copy: false  --->
{#each expression as name}...{:else}...{/each}
```

An each block can also have an `{:else}` clause, which is rendered if the list is empty.

```svelte
{#each todos as todo}
  <p>{todo.text}</p>
{:else}
  <p>No tasks today!</p>
{/each}
```

## `{#key ...}`


```svelte
<!--- copy: false  --->
{#key expression}...{/key}
```

Key blocks destroy and recreate their contents when the value of an expression changes. When used around components, this will cause them to be reinstantiated and reinitialised:

```svelte
{#key value}
  <Component />
{/key}
```

It's also useful if you want a transition to play whenever a value changes:

```svelte
{#key value}
  <div transition:fade>{value}</div>
{/key}
```

## `{#await ...}` blocks


```svelte
<!--- copy: false  --->
{#await expression}...{:then name}...{:catch name}...{/await}
```

```svelte
<!--- copy: false  --->
{#await expression}...{:then name}...{/await}
```

```svelte
<!--- copy: false  --->
{#await expression then name}...{/await}
```

```svelte
<!--- copy: false  --->
{#await expression catch name}...{/await}
```

Await blocks allow you to branch on the three possible states of a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) — pending, fulfilled or rejected.

```svelte
{#await promise}
  <!-- promise is pending -->
  <p>waiting for the promise to resolve...</p>
{:then value}
  <!-- promise was fulfilled or not a Promise -->
  <p>The value is {value}</p>
{:catch error}
  <!-- promise was rejected -->
  <p>Something went wrong: {error.message}</p>
{/await}
```

> [!NOTE] During server-side rendering, only the pending branch will be rendered.
>
> If the provided expression is not a `Promise` only the `:then` branch will be rendered, including during server-side rendering.

The `catch` block can be omitted if you don't need to render anything when the promise rejects (or no error is possible).

```svelte
{#await promise}
  <!-- promise is pending -->
  <p>waiting for the promise to resolve...</p>
{:then value}
  <!-- promise was fulfilled -->
  <p>The value is {value}</p>
{/await}
```

If you don't care about the pending state, you can also omit the initial block.

```svelte
{#await promise then value}
  <p>The value is {value}</p>
{/await}
```

Similarly, if you only want to show the error state, you can omit the `then` block.

```svelte
{#await promise catch error}
  <p>The error is {error}</p>
{/await}
```

## `{#snippet ...}`


```svelte
<!--- copy: false  --->
{#snippet name()}...{/snippet}
```

```svelte
<!--- copy: false  --->
{#snippet name(param1, param2, paramN)}...{/snippet}
```

Snippets, and [render tags](@render), are a way to create reusable chunks of markup inside your components. Instead of writing duplicative code like [this](/playground/untitled#H4sIAAAAAAAAE5VUYW-kIBD9K8Tmsm2yXXRzvQ-s3eR-R-0HqqOQKhAZb9sz_vdDkV1t000vRmHewMx7w2AflbIGG7GnPlK8gYhFv42JthG-m9Gwf6BGcLbVXZuPSGrzVho8ZirDGpDIhldgySN5GpEMez9kaNuckY1ANJZRamRuu2ZnhEZt6a84pvs43mzD4pMsUDDi8DMkQFYCGdkvsJwblFq5uCik9bmJ4JZwUkv1eoknWigX2eGNN6aGXa6bjV8ybP-X7sM36T58SVcrIIV2xVIaA41xeD5kKqWXuqpUJEefOqVuOkL9DfBchGrzWfu0vb-RpTd3o-zBR045Ga3HfuE5BmJpKauuhbPtENlUF2sqR9jqpsPSxWsMrlngyj3VJiyYjJXb1-lMa7IWC-iSk2M5Zzh-SJjShe-siq5kpZRPs55BbSGU5YPyte4vVV_VfFXxVb10dSLf17pS2lM5HnpPxw4Zpv6x-F57p0jI3OKlVnhv5V9wPQrNYQQ9D_f6aGHlC89fq1Z3qmDkJCTCweOGF4VUFSPJvD_DhreVdA0eu8ehJJ5x91dBaBkpWm3ureCFPt3uzRv56d4kdp-2euG38XZ6dsnd3ZmPG9yRBCrzRUvi-MccOdwz3qE-fOZ7AwAhlrtTUx3c76vRhSwlFBHDtoPhefgHX3dM0PkEAAA=)...

```svelte
{#each images as image}
  {#if image.href}
    <a href={image.href}>
      <figure>
        <img src={image.src} alt={image.caption} width={image.width} height={image.height} />
        <figcaption>{image.caption}</figcaption>
      </figure>
    </a>
  {:else}
    <figure>
      <img src={image.src} alt={image.caption} width={image.width} height={image.height} />
      <figcaption>{image.caption}</figcaption>
    </figure>
  {/if}
{/each}
```

...you can write [this](/playground/untitled#H4sIAAAAAAAAE5VUYW-bMBD9KxbRlERKY4jWfSA02n5H6QcXDmwVbMs-lnaI_z6D7TTt1moTAnPvzvfenQ_GpBEd2CS_HxPJekjy5IfWyS7BFz0b9id0CM62ajDVjBS2MkLjqZQldoBE9KwFS-7I_YyUOPqlRGuqnKw5orY5pVpUduj3mitUln5LU3pI0_UuBp9FjTwnDr9AHETLMSeHK6xiGoWSLi9yYT034cwSRjohn17zcQPNFTs8s153sK9Uv_Yh0-5_5d7-o9zbD-UqCaRWrllSYZQxLw_HUhb0ta-y4NnJUxfUvc7QuLJSaO0a3oh2MLBZat8u-wsPnXzKQvTtVVF34xK5d69ThFmHEQ4SpzeVRediTG8rjD5vBSeN3E5JyHh6R1DQK9-iml5kjzQUN_lSgVU8DhYLx7wwjSvRkMDvTjiwF4zM1kXZ7DlF1eN3A7IG85e-zRrYEjjm0FkI4Cc7Ripm0pHOChexhcWXzreeZyRMU6Mk3ljxC9w4QH-cQZ_b3T5pjHxk1VNr1CDrnJy5QDh6XLO6FrLNSRb2l9gz0wo3S6m7HErSgLsPGMHkpDZK31jOanXeHPQz-eruLHUP0z6yTbpbrn223V70uMXNSpQSZjpL0y8hcxxpNqA6_ql3BQAxlxvfpQ_uT9GrWjQC6iRHM8D0MP0GQsIi92QEAAA=):

```svelte
{#snippet figure(image)}
  <figure>
    <img src={image.src} alt={image.caption} width={image.width} height={image.height} />
    <figcaption>{image.caption}</figcaption>
  </figure>
{/snippet}

{#each images as image}
  {#if image.href}
    <a href={image.href}>
      {@render figure(image)}
    </a>
  {:else}
    {@render figure(image)}
  {/if}
{/each}
```

Like function declarations, snippets can have an arbitrary number of parameters, which can have default values, and you can destructure each parameter. You cannot use rest parameters however.

## Snippet scope

Snippets can be declared anywhere inside your component. They can reference values declared outside themselves, for example in the `<script>` tag or in `{#each ...}` blocks ([demo](/playground/untitled#H4sIAAAAAAAAE12P0QrCMAxFfyWrwhSEvc8p-h1OcG5RC10bmkyQ0n-3HQPBx3vCPUmCemiDrOpLULYbUdXqTKR2Sj6UA7_RCKbMbvJ9Jg33XpMcW9uKQYEAIzJ3T4QD3LSUDE-PnYA4YET4uOkGMc3W5B3xZrtvbVP9HDas2GqiZHqhMW6Tr9jGbG_oOCMImcUCwrIpFk1FqRyqpRpn0cmjHdAvnrIzuscyq_4nd3dPPD01ukE_NA6qFj9hvMYvGjJADw8BAAA=))...

```svelte
<script>
  let { message = `it's great to see you!` } = $props();
</script>

{#snippet hello(name)}
  <p>hello {name}! {message}!</p>
{/snippet}

{@render hello('alice')}
{@render hello('bob')}
```

...and they are 'visible' to everything in the same lexical scope (i.e. siblings, and children of those siblings):

```svelte
<div>
  {#snippet x()}
    {#snippet y()}...{/snippet}

    <!-- this is fine -->
    {@render y()}
  {/snippet}

  <!-- this will error, as `y` is not in scope -->
  {@render y()}
</div>

<!-- this will also error, as `x` is not in scope -->
{@render x()}
```

Snippets can reference themselves and each other ([demo](/playground/untitled#H4sIAAAAAAAAE2WPTQqDMBCFrxLiRqH1Zysi7TlqF1YnENBJSGJLCYGeo5tesUeosfYH3c2bee_jjaWMd6BpfrAU6x5oTvdS0g01V-mFPkNnYNRaDKrxGxto5FKCIaeu1kYwFkauwsoUWtZYPh_3W5FMY4U2mb3egL9kIwY0rbhgiO-sDTgjSEqSTvIDs-jiOP7i_MHuFGAL6p9BtiSbOTl0GtzCuihqE87cqtyam6WRGz_vRcsZh5bmRg3gju4Fptq_kzQBAAA=)):

```svelte
{#snippet blastoff()}
  <span>🚀</span>
{/snippet}

{#snippet countdown(n)}
  {#if n > 0}
    <span>{n}...</span>
    {@render countdown(n - 1)}
  {:else}
    {@render blastoff()}
  {/if}
{/snippet}

{@render countdown(10)}
```

## Passing snippets to components

Within the template, snippets are values just like any other. As such, they can be passed to components as props ([demo](/playground/untitled#H4sIAAAAAAAAE41SwY6bMBD9lRGplKQlYRMpF5ZF7T_0ttmDwSZYJbZrT9pGlv-9g4Fkk-xhxYV5vHlvhjc-aWQnXJK_-kSxo0jy5IcxSZrg2fSF-yM6FFQ7fbJ1jxSuttJguVd7lEejLcJPVnUCGquPMF9nsVoPjfNnohGx1sohMU4SHbzAa4_t0UNvmcOcGUNDzFP4jeccdikYK2v6sIWQ3lErpui5cDdPF_LmkVy3wlp5Vd5e2U_rHYSe_kYjFtl1KeVnTkljBEIrGBd2sYy8AtsyLlBk9DYhJHtTR_UbBDWybkR8NkqHWyOr_y74ZMNLz9f9AoG6ePkOJLMHLBp-xISvcPf11r0YUuMM2Ysfkgngh5XphUYKkJWU_FFz2UjBkxztSYT0cihR4LOn0tGaPrql439N-7Uh0Dl8MVYbt1jeJ1Fg7xDb_Uw2Y18YQqZ_S2U5FH1pS__dCkWMa3C0uR0pfQRTg89kE4bLLLDS_Dxy_Eywuo1TAnPAw4fqY1rvtH3W9w35ZZMgvU3jq8LhedwkguCHRhT_cMU6eVA5dKLB5wGutCWjlTOslupAxxrxceKoD2hzhe2qbmXHF1v1bbOcNCtW_zpYfVI8h5kQ4qY3mueHTlesW2C7TOEO4hcdwzgf3Nc7cZxUKKC4yuNhvIX_MlV_Xk0EAAA=)):

```svelte
<script>
  import Table from './Table.svelte';

  const fruits = [
    { name: 'apples', qty: 5, price: 2 },
    { name: 'bananas', qty: 10, price: 1 },
    { name: 'cherries', qty: 20, price: 0.5 }
  ];
</script>

{#snippet header()}
  <th>fruit</th>
  <th>qty</th>
  <th>price</th>
  <th>total</th>
{/snippet}

{#snippet row(d)}
  <td>{d.name}</td>
  <td>{d.qty}</td>
  <td>{d.price}</td>
  <td>{d.qty * d.price}</td>
{/snippet}

<Table data={fruits} {header} {row} />
```

Think about it like passing content instead of data to a component. The concept is similar to slots in web components.

As an authoring convenience, snippets declared directly _inside_ a component implicitly become props _on_ the component ([demo](/playground/untitled#H4sIAAAAAAAAE41Sy27bMBD8lYVcwHYrW4kBXxRFaP-htzgHSqQsojLJkuu2BqF_74qUrfhxCHQRh7MzO9z1SSM74ZL8zSeKHUSSJz-MSdIET2Y4uD-iQ0Fnp4-2HpDC1VYaLHdqh_JgtEX4yapOQGP1AebrLJzWsXD-QjQi1lo5JMZRooNXeBuwHXoYLHOYM2OoiXkKv_GUwzYFY2VNFxvo0xtqxRR9F-7z04X8fE-uW2GtnJQ3E_tpvYV-oL9Ti0U2hVJFjMMZslcfW-5DWj9zShojEFrBuLCLZR_9CmzLQCwy-psw8rxBgvkNhhpZd8F8NppE7Stbq_8u-GTKS8_XQ9Keqnl5BZP1AzTYP2bDV7i7_9hLEeda0iocNJeNFDzJ0R5Fn142JzA-uzsdBfLhldPxPdMhIPS0H1-M1cYtlnejwdBDfBXZjHXTFOg4BhuOtvTfrVDEmAZG2ew5ezYV-Ew2fVzVAivNTyPHzwSr29AlMAe8f6g-zuWDts-GusAmdBSkv3P7qnB4GpMEEHwsRPEPV6yTe5VDJxp8iXClLRmtnGG1VHva3oCPHQd9QJsrbFd1Kzu-2Khvz8uzZsXqX3urj4rnMBNCXNUG83zf6Yp1C2yXKdxA_KJjGOfRfb0Vh7MKDShEuV-M9_4_nq6svF4EAAA=)):

```svelte
<!-- this is semantically the same as the above -->
<Table data={fruits}>
  {#snippet header()}
    <th>fruit</th>
    <th>qty</th>
    <th>price</th>
    <th>total</th>
  {/snippet}

  {#snippet row(d)}
    <td>{d.name}</td>
    <td>{d.qty}</td>
    <td>{d.price}</td>
    <td>{d.qty * d.price}</td>
  {/snippet}
</Table>
```

Any content inside the component tags that is _not_ a snippet declaration implicitly becomes part of the `children` snippet ([demo](/playground/untitled#H4sIAAAAAAAAE41S247aMBD9lVFYCegGsiDxks1G7T_0bdkHJ3aI1cR27aEtsvzvtZ0LZeGhiiJ5js-cmTMemzS8YybJ320iSM-SPPmmVJImeFEhML9Yh8zHRp51HZDC1JorLI_iiLxXUiN8J1XHoNGyh-U2i9F2SFy-epon1lIY9IwzRwNv8B6wI1oIJXNYEqV8E8sUfuIlh0MKSvPaX-zBpZ-oFRH-m7m7l5m8uyfXLdOaX5X3V_bL9gAu0D98i0V2NSWKwQ4lSN7s0LKLbgtsyxgXmT9NiBe-iaP-DYISSTcj4bcLI7hSDEHL3yu6dkPfBdLS0m1o3nk-LW9gX-gBGss9ZsMXuLu32VjZBdfRaelft5eUN5zRJEd9Zi6dlyEy_ncdOm_IxsGlULe8o5qJNFgE5x_9SWmpzGp9N2-MXQxz4c2cOQ-lZWQyF0Jd2q_-mjI9U1fr4FBPE8iuKTbjjRt2sMBK0svIsQtG6jb2CsQAdQ_1x9f5R9tmIS-yPToK-tNkQRQGL6ObCIIdEpH9wQ3p-Enk0LEGXwe4ktoX2hhFai5Ofi0jPnYc9QF1LrDdRK-rvXjerSfNitQ_TlqeBc1hwRi7yY3F81MnK9KtsF2n8Amis44ilA7VtwfWTyr-kaKV-_X4cH8BTOhfRzcEAAA=)):

```svelte
<!--- file: App.svelte --->
<Button>click me<Button>
```

```svelte
<!--- file: Button.svelte --->
<script>
  let { children } = $props();
</script>

<!-- result will be <button>click me</button> -->
<button>{@render children()}</button>
```

> [!NOTE] Note that you cannot have a prop called `children` if you also have content inside the component — for this reason, you should avoid having props with that name

You can declare snippet props as being optional. You can either use optional chaining to not render anything if the snippet isn't set...

```svelte
<script>
    let { children } = $props();
</script>

{@render children?.()}
```

...or use an `#if` block to render fallback content:

```svelte
<script>
    let { children } = $props();
</script>

{#if children}
    {@render children()}
{:else}
    fallback content
{/if}
```

## Typing snippets

Snippets implement the `Snippet` interface imported from `'svelte'`:

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    data: any[];
    children: Snippet;
    row: Snippet<[any]>;
  }

  let { data, children, row }: Props = $props();
</script>
```

With this change, red squigglies will appear if you try and use the component without providing a `data` prop and a `row` snippet. Notice that the type argument provided to `Snippet` is a tuple, since snippets can have multiple parameters.

We can tighten things up further by declaring a generic, so that `data` and `row` refer to the same type:

```svelte
<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';

  let {
    data,
    children,
    row
  }: {
    data: T[];
    children: Snippet;
    row: Snippet<[T]>;
  } = $props();
</script>
```

## Programmatic snippets

Snippets can be created programmatically with the [`createRawSnippet`](svelte#createRawSnippet) API. This is intended for advanced use cases.

## Snippets and slots

In Svelte 4, content can be passed to components using [slots](legacy-slots). Snippets are more powerful and flexible, and as such slots are deprecated in Svelte 5.

## `{@render ...}`


To render a [snippet](snippet), use a `{@render ...}` tag.

```svelte
{#snippet sum(a, b)}
  <p>{a} + {b} = {a + b}</p>
{/snippet}

{@render sum(1, 2)}
{@render sum(3, 4)}
{@render sum(5, 6)}
```

The expression can be an identifier like `sum`, or an arbitrary JavaScript expression:

```svelte
{@render (cool ? coolSnippet : lameSnippet)()}
```

## Optional snippets

If the snippet is potentially undefined — for example, because it's an incoming prop — then you can use optional chaining to only render it when it _is_ defined:

```svelte
{@render children?.()}
```

Alternatively, use an [`{#if ...}`](if) block with an `:else` clause to render fallback content:

```svelte
{#if children}
  {@render children()}
{:else}
  <p>fallback content</p>
{/if}

```

## `{@html ...}`

To inject raw HTML into your component, use the `{@html ...}` tag:

```svelte
<article>
  {@html content}
</article>
```

> [!NOTE] Make sure that you either escape the passed string or only populate it with values that are under your control in order to prevent [XSS attacks](https://owasp.org/www-community/attacks/xss/). Never render unsanitized content.

The expression should be valid standalone HTML — this will not work, because `</div>` is not valid HTML:

```svelte
{@html '<div>'}content{@html '</div>'}
```

It also will not compile Svelte code.

## Styling

Content rendered this way is 'invisible' to Svelte and as such will not receive [scoped styles](scoped-styles) — in other words, this will not work, and the `a` and `img` styles will be regarded as unused:

<!-- prettier-ignore -->
```svelte
<article>
  {@html content}
</article>

<style>
  article {
    a { color: hotpink }
    img { width: 100% }
  }
</style>
```

Instead, use the `:global` modifier to target everything inside the `<article>`:

<!-- prettier-ignore -->
```svelte
<style>
  article +++:global+++ {
    a { color: hotpink }
    img { width: 100% }
  }
</style>
```

## `{@const ...}`

The `{@const ...}` tag defines a local constant.

```svelte
{#each boxes as box}
  {@const area = box.width * box.height}
  {box.width} * {box.height} = {area}
{/each}
```

`{@const}` is only allowed as an immediate child of a block — `{#if ...}`, `{#each ...}`, `{#snippet ...}` and so on — or a `<Component />`.

## `{@debug ...}`

The `{@debug ...}` tag offers an alternative to `console.log(...)`. It logs the values of specific variables whenever they change, and pauses code execution if you have devtools open.

```svelte
<script>
  let user = {
    firstname: 'Ada',
    lastname: 'Lovelace'
  };
</script>

{@debug user}

<h1>Hello {user.firstname}!</h1>
```

`{@debug ...}` accepts a comma-separated list of variable names (not arbitrary expressions).

```svelte
<!-- Compiles -->
{@debug user}
{@debug user1, user2, user3}

<!-- WON'T compile -->
{@debug user.firstname}
{@debug myArray[0]}
{@debug !isReady}
{@debug typeof user === 'object'}

```

The `{@debug}` tag without any arguments will insert a `debugger` statement that gets triggered when _any_ state changes, as opposed to the specified variables.

## `bind:` directive

Data ordinarily flows down, from parent to child. The `bind:` directive allows data to flow the other way, from child to parent.

The general syntax is `bind:property={expression}`, where `expression` is an _lvalue_ (i.e. a variable or an object property). When the expression is an identifier with the same name as the property, we can omit the expression — in other words these are equivalent:

<!-- prettier-ignore -->
```svelte
<input bind:value={value} />
<input bind:value />
```

Svelte creates an event listener that updates the bound value. If an element already has a listener for the same event, that listener will be fired before the bound value is updated.

Most bindings are _two-way_, meaning that changes to the value will affect the element and vice versa. A few bindings are _readonly_, meaning that changing their value will have no effect on the element.

## `<input bind:value>`

A `bind:value` directive on an `<input>` element binds the input's `value` property:

<!-- prettier-ignore -->
```svelte
<script>
  let message = $state('hello');
</script>

<input bind:value={message} />
<p>{message}</p>
```

In the case of a numeric input (`type="number"` or `type="range"`), the value will be coerced to a number ([demo](/playground/untitled#H4sIAAAAAAAAE6WPwYoCMQxAfyWEPeyiOOqx2w74Hds9pBql0IllmhGXYf5dKqwiyILsLXnwwsuI-5i4oPkaUX8yo7kCnKNQV7dNzoty4qSVBSr8jG-Poixa0KAt2z5mbb14TaxA4OCtKCm_rz4-f2m403WltrlrYhMFTtcLNkoeFGqZ8yhDF7j3CCHKzpwoDexGmqCL4jwuPUJHZ-dxVcfmyYGe5MAv-La5pbxYFf5Z9Zf_UJXb-sEMquFgJJhBmGyTW5yj8lnRaD_w9D1dAKSSj7zqAQAA)):

```svelte
<script>
  let a = $state(1);
  let b = $state(2);
</script>

<label>
  <input type="number" bind:value={a} min="0" max="10" />
  <input type="range" bind:value={a} min="0" max="10" />
</label>

<label>
  <input type="number" bind:value={b} min="0" max="10" />
  <input type="range" bind:value={b} min="0" max="10" />
</label>

<p>{a} + {b} = {a + b}</p>
```

If the input is empty or invalid (in the case of `type="number"`), the value is `undefined`.

## `<input bind:checked>`

Checkbox and radio inputs can be bound with `bind:checked`:

```svelte
<label>
  <input type="checkbox" bind:checked={accepted} />
  Accept terms and conditions
</label>
```

## `<input bind:group>`

Inputs that work together can use `bind:group`.

```svelte
<script>
  let tortilla = 'Plain';

  /** @type {Array<string>} */
  let fillings = [];
</script>

<!-- grouped radio inputs are mutually exclusive -->
<input type="radio" bind:group={tortilla} value="Plain" />
<input type="radio" bind:group={tortilla} value="Whole wheat" />
<input type="radio" bind:group={tortilla} value="Spinach" />

<!-- grouped checkbox inputs populate an array -->
<input type="checkbox" bind:group={fillings} value="Rice" />
<input type="checkbox" bind:group={fillings} value="Beans" />
<input type="checkbox" bind:group={fillings} value="Cheese" />
<input type="checkbox" bind:group={fillings} value="Guac (extra)" />
```

> [!NOTE] `bind:group` only works if the inputs are in the same Svelte component.

## `<input bind:files>`

On `<input>` elements with `type="file"`, you can use `bind:files` to get the [`FileList` of selected files](https://developer.mozilla.org/en-US/docs/Web/API/FileList). When you want to update the files programmatically, you always need to use a `FileList` object. Currently `FileList` objects cannot be constructed directly, so you need to create a new [`DataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) object and get `files` from there.

```svelte
<script>
  let files = $state();

  function clear() {
    files = new DataTransfer().files; // null or undefined does not work
  }
</script>

<label for="avatar">Upload a picture:</label>
<input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" />
<button onclick={clear}>clear</button>
```

`FileList` objects also cannot be modified, so if you want to e.g. delete a single file from the list, you need to create a new `DataTransfer` object and add the files you want to keep.

> [!NOTE] `DataTransfer` may not be available in server-side JS runtimes. Leaving the state that is bound to `files` uninitialized prevents potential errors if components are server-side rendered.

## `<select bind:value>`

A `<select>` value binding corresponds to the `value` property on the selected `<option>`, which can be any value (not just strings, as is normally the case in the DOM).

```svelte
<select bind:value={selected}>
  <option value={a}>a</option>
  <option value={b}>b</option>
  <option value={c}>c</option>
</select>
```

A `<select multiple>` element behaves similarly to a checkbox group. The bound variable is an array with an entry corresponding to the `value` property of each selected `<option>`.

```svelte
<select multiple bind:value={fillings}>
  <option value="Rice">Rice</option>
  <option value="Beans">Beans</option>
  <option value="Cheese">Cheese</option>
  <option value="Guac (extra)">Guac (extra)</option>
</select>
```

When the value of an `<option>` matches its text content, the attribute can be omitted.

```svelte
<select multiple bind:value={fillings}>
  <option>Rice</option>
  <option>Beans</option>
  <option>Cheese</option>
  <option>Guac (extra)</option>
</select>
```

## `<audio>`

`<audio>` elements have their own set of bindings — five two-way ones...

- [`currentTime`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime)
- [`playbackRate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate)
- [`paused`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/paused)
- [`volume`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume)
- [`muted`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted)

...and seven readonly ones:

- [`duration`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration)
- [`buffered`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered)
- [`paused`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/paused)
- [`seekable`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable)
- [`seeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event)
- [`ended`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended)
- [`readyState`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState)

```svelte
<audio src={clip} bind:duration bind:currentTime bind:paused></audio>
```

## `<video>`

`<video>` elements have all the same bindings as [#audio] elements, plus readonly [`videoWidth`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoWidth) and [`videoHeight`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight) bindings.

## `<img>`

`<img>` elements have two readonly bindings:

- [`naturalWidth`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalWidth)
- [`naturalHeight`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalHeight)

## `<details bind:open>`

`<details>` elements support binding to the `open` property.

```svelte
<details bind:open={isOpen}>
  <summary>How do you comfort a JavaScript bug?</summary>
  <p>You console it.</p>
</details>
```

## Contenteditable bindings

Elements with the `contenteditable` attribute support the following bindings:

- [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [`innerText`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText)
- [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

> [!NOTE] There are [subtle differences between `innerText` and `textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext).

<!-- for some reason puts the comment and html on same line -->
<!-- prettier-ignore -->
```svelte
<div contenteditable="true" bind:innerHTML={html} />
```

## Dimensions

All visible elements have the following readonly bindings, measured with a `ResizeObserver`:

- [`clientWidth`](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth)
- [`clientHeight`](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight)
- [`offsetWidth`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth)
- [`offsetHeight`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight)

```svelte
<div bind:offsetWidth={width} bind:offsetHeight={height}>
  <Chart {width} {height} />
</div>
```

## bind:this

```svelte
<!--- copy: false --->
bind:this={dom_node}
```

To get a reference to a DOM node, use `bind:this`. The value will be `undefined` until the component is mounted — in other words, you should read it inside an effect or an event handler, but not during component initialisation:

```svelte
<script>
  /** @type {HTMLCanvasElement} */
  let canvas;

  $effect(() => {
    const ctx = canvas.getContext('2d');
    drawStuff(ctx);
  });
</script>

<canvas bind:this={canvas} />
```

Components also support `bind:this`, allowing you to interact with component instances programmatically.

```svelte
<!--- file: App.svelte --->
<ShoppingCart bind:this={cart} />

<button onclick={() => cart.empty()}> Empty shopping cart </button>
```

```svelte
<!--- file: ShoppingCart.svelte --->
<script>
  // All instance exports are available on the instance object
  export function empty() {
    // ...
  }
</script>
```

## bind:_property_ for components

```svelte
bind:property={variable}
```

You can bind to component props using the same syntax as for elements.

```svelte
<Keypad bind:value={pin} />
```

While Svelte props are reactive without binding, that reactivity only flows downward into the component by default. Using `bind:property` allows changes to the property from within the component to flow back up out of the component.

To mark a property as bindable, use the [`$bindable`]($bindable) rune:

```svelte
<script>
  let { readonlyProperty, bindableProperty = $bindable() } = $props();
</script>
```

Declaring a property as bindable means it _can_ be used using `bind:`, not that it _must_ be used using `bind:`.

Bindable properties can have a fallback value:

```svelte
<script>
  let { bindableProperty = $bindable('fallback value') } = $props();
</script>
```

This fallback value _only_ applies when the property is _not_ bound. When the property is bound and a fallback value is present, the parent is expected to provide a value other than `undefined`, else a runtime error is thrown. This prevents hard-to-reason-about situations where it's unclear which value should apply.

## `use:` directive

Actions are functions that are called when an element is mounted. They are added with the `use:` directive, and will typically use an `$effect` so that they can reset any state when the element is unmounted:

```svelte
<!--- file: App.svelte --->
<script>
  /** @type {import('svelte/action').Action} */
  function myaction(node) {
    // the node has been mounted in the DOM

    $effect(() => {
      // setup goes here

      return () => {
        // teardown goes here
      };
    });
  }
</script>

<div use:myaction>...</div>
```

An action can be called with an argument:

```svelte
<!--- file: App.svelte --->
<script>
  /** @type {import('svelte/action').Action} */
  function myaction(node, +++data+++) {
    // ...
  }
</script>

<div use:myaction={+++data+++}>...</div>
```

The action is only called once (but not during server-side rendering) — it will _not_ run again if the argument changes.

> [!LEGACY]
> Prior to the `$effect` rune, actions could return an object with `update` and `destroy` methods, where `update` would be called with the latest value of the argument if it changed. Using effects is preferred.

## Typing

The `Action` interface receives three optional type arguments — a node type (which can be `Element`, if the action applies to everything), a parameter, and any custom event handlers created by the action.:

```svelte
<!--- file: App.svelte --->
<script>
  import { on } from 'svelte/events';

  /**
   * @type {import('svelte/action').Action<
   * 	HTMLDivElement,
   * 	null,
   * 	{
   * 		onswiperight: (e: CustomEvent) => void;
   * 		onswipeleft: (e: CustomEvent) => void;
   * 		// ...
   * }>}
   */
  function gestures(node) {
    $effect(() => {
      // ...
      node.dispatchEvent(new CustomEvent('swipeleft'));

      // ...
      node.dispatchEvent(new CustomEvent('swiperight'));
    });
  }
</script>

<div
  use:gestures
  onswipeleft={next}
  onswiperight={prev}
>...</div>
```

## `transition:` directive

A _transition_ is triggered by an element entering or leaving the DOM as a result of a state change.

When a block (such as an `{#if ...}` block) is transitioning out, all elements inside it, including those that do not have their own transitions, are kept in the DOM until every transition in the block has been completed.

The `transition:` directive indicates a _bidirectional_ transition, which means it can be smoothly reversed while the transition is in progress.

```svelte
<script>
  +++import { fade } from 'svelte/transition';+++

  let visible = $state(false);
</script>

<button onclick={() => visible = !visible}>toggle</button>

{#if visible}
  <div +++transition:fade+++>fades in and out</div>
{/if}
```

## Built-in transitions

A selection of built-in transitions can be imported from the [`svelte/transition`](svelte-transition) module.

## Local vs global

Transitions are local by default. Local transitions only play when the block they belong to is created or destroyed, _not_ when parent blocks are created or destroyed.

```svelte
{#if x}
  {#if y}
    <p transition:fade>fades in and out only when y changes</p>

    <p transition:fade|global>fades in and out when x or y change</p>
  {/if}
{/if}
```

## Transition parameters

Transitions can have parameters.

(The double `{{curlies}}` aren't a special syntax; this is an object literal inside an expression tag.)

```svelte
{#if visible}
  <div transition:fade={{ duration: 2000 }}>fades in and out over two seconds</div>
{/if}
```

## Custom transition functions

```js
/// copy: false
// @noErrors
transition = (node: HTMLElement, params: any, options: { direction: 'in' | 'out' | 'both' }) => {
  delay?: number,
  duration?: number,
  easing?: (t: number) => number,
  css?: (t: number, u: number) => string,
  tick?: (t: number, u: number) => void
}
```

Transitions can use custom functions. If the returned object has a `css` function, Svelte will generate keyframes for a [web animation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

The `t` argument passed to `css` is a value between `0` and `1` after the `easing` function has been applied. _In_ transitions run from `0` to `1`, _out_ transitions run from `1` to `0` — in other words, `1` is the element's natural state, as though no transition had been applied. The `u` argument is equal to `1 - t`.

The function is called repeatedly _before_ the transition begins, with different `t` and `u` arguments.

```svelte
<!--- file: App.svelte --->
<script>
  import { elasticOut } from 'svelte/easing';

  /** @type {boolean} */
  export let visible;

  /**
   * @param {HTMLElement} node
   * @param {{ delay?: number, duration?: number, easing?: (t: number) => number }} params
   */
  function whoosh(node, params) {
    const existingTransform = getComputedStyle(node).transform.replace('none', '');

    return {
      delay: params.delay || 0,
      duration: params.duration || 400,
      easing: params.easing || elasticOut,
      css: (t, u) => `transform: ${existingTransform} scale(${t})`
    };
  }
</script>

{#if visible}
  <div in:whoosh>whooshes in</div>
{/if}
```

A custom transition function can also return a `tick` function, which is called _during_ the transition with the same `t` and `u` arguments.

> [!NOTE] If it's possible to use `css` instead of `tick`, do so — web animations can run off the main thread, preventing jank on slower devices.

```svelte
<!--- file: App.svelte --->
<script>
  export let visible = false;

  /**
   * @param {HTMLElement} node
   * @param {{ speed?: number }} params
   */
  function typewriter(node, { speed = 1 }) {
    const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

    if (!valid) {
      throw new Error(`This transition only works on elements with a single text node child`);
    }

    const text = node.textContent;
    const duration = text.length / (speed * 0.01);

    return {
      duration,
      tick: (t) => {
        const i = ~~(text.length * t);
        node.textContent = text.slice(0, i);
      }
    };
  }
</script>

{#if visible}
  <p in:typewriter={{ speed: 1 }}>The quick brown fox jumps over the lazy dog</p>
{/if}
```

If a transition returns a function instead of a transition object, the function will be called in the next microtask. This allows multiple transitions to coordinate, making [crossfade effects](/tutorial/deferred-transitions) possible.

Transition functions also receive a third argument, `options`, which contains information about the transition.

Available values in the `options` object are:

- `direction` - one of `in`, `out`, or `both` depending on the type of transition

## Transition events

An element with transitions will dispatch the following events in addition to any standard DOM events:

- `introstart`
- `introend`
- `outrostart`
- `outroend`

```svelte
{#if visible}
  <p
    transition:fly={{ y: 200, duration: 2000 }}
    onintrostart={() => (status = 'intro started')}
    onoutrostart={() => (status = 'outro started')}
    onintroend={() => (status = 'intro ended')}
    onoutroend={() => (status = 'outro ended')}
  >
    Flies in and out
  </p>
{/if}

```

## `in: and out:` directives

The `in:` and `out:` directives are identical to [`transition:`](transition), except that the resulting transitions are not bidirectional — an `in` transition will continue to 'play' alongside the `out` transition, rather than reversing, if the block is outroed while the transition is in progress. If an out transition is aborted, transitions will restart from scratch.

```svelte
{#if visible}
  <div in:fly out:fade>flies in, fades out</div>
{/if}
```

## `animate:` directive

An animation is triggered when the contents of a [keyed each block](each#Keyed-each-blocks) are re-ordered. Animations do not run when an element is added or removed, only when the index of an existing data item within the each block changes. Animate directives must be on an element that is an _immediate_ child of a keyed each block.

Animations can be used with Svelte's [built-in animation functions](svelte-animate) or [custom animation functions](#Custom-animation-functions).

```svelte
<!-- When `list` is reordered the animation will run-->
{#each list as item, index (item)}
  <li animate:flip>{item}</li>
{/each}
```

## Animation Parameters

As with actions and transitions, animations can have parameters.

(The double `{{curlies}}` aren't a special syntax; this is an object literal inside an expression tag.)

```svelte
{#each list as item, index (item)}
  <li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

## Custom animation functions

```js
/// copy: false
// @noErrors
animation = (node: HTMLElement, { from: DOMRect, to: DOMRect } , params: any) => {
  delay?: number,
  duration?: number,
  easing?: (t: number) => number,
  css?: (t: number, u: number) => string,
  tick?: (t: number, u: number) => void
}
```

Animations can use custom functions that provide the `node`, an `animation` object and any `parameters` as arguments. The `animation` parameter is an object containing `from` and `to` properties each containing a [DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect#Properties) describing the geometry of the element in its `start` and `end` positions. The `from` property is the DOMRect of the element in its starting position, and the `to` property is the DOMRect of the element in its final position after the list has been reordered and the DOM updated.

If the returned object has a `css` method, Svelte will create a [web animation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) that plays on the element.

The `t` argument passed to `css` is a value that goes from `0` and `1` after the `easing` function has been applied. The `u` argument is equal to `1 - t`.

The function is called repeatedly _before_ the animation begins, with different `t` and `u` arguments.

<!-- TODO: Types -->

```svelte
<!--- file: App.svelte --->
<script>
  import { cubicOut } from 'svelte/easing';

  /**
   * @param {HTMLElement} node
   * @param {{ from: DOMRect; to: DOMRect }} states
   * @param {any} params
   */
  function whizz(node, { from, to }, params) {
    const dx = from.left - to.left;
    const dy = from.top - to.top;

    const d = Math.sqrt(dx * dx + dy * dy);

    return {
      delay: 0,
      duration: Math.sqrt(d) * 120,
      easing: cubicOut,
      css: (t, u) => `transform: translate(${u * dx}px, ${u * dy}px) rotate(${t * 360}deg);`
    };
  }
</script>

{#each list as item, index (item)}
  <div animate:whizz>{item}</div>
{/each}
```

A custom animation function can also return a `tick` function, which is called _during_ the animation with the same `t` and `u` arguments.

> [!NOTE] If it's possible to use `css` instead of `tick`, do so — web animations can run off the main thread, preventing jank on slower devices.

```svelte
<!--- file: App.svelte --->
<script>
  import { cubicOut } from 'svelte/easing';

  /**
   * @param {HTMLElement} node
   * @param {{ from: DOMRect; to: DOMRect }} states
   * @param {any} params
   */
  function whizz(node, { from, to }, params) {
    const dx = from.left - to.left;
    const dy = from.top - to.top;

    const d = Math.sqrt(dx * dx + dy * dy);

    return {
      delay: 0,
      duration: Math.sqrt(d) * 120,
      easing: cubicOut,
      tick: (t, u) => Object.assign(node.style, { color: t > 0.5 ? 'Pink' : 'Blue' })
    };
  }
</script>

{#each list as item, index (item)}
  <div animate:whizz>{item}</div>
{/each}
```

## `class:` directive

The `class:` directive is a convenient way to conditionally set classes on elements, as an alternative to using conditional expressions inside `class` attributes:

```svelte
<!-- These are equivalent -->
<div class={isCool ? 'cool' : ''}>...</div>
<div class:cool={isCool}>...</div>
```

As with other directives, we can use a shorthand when the name of the class coincides with the value:

```svelte
<div class:cool>...</div>
```

Multiple `class:` directives can be added to a single element:

```svelte
<div class:cool class:lame={!cool} class:potato>...</div>
```

## `style:` directive

The `style:` directive provides a shorthand for setting multiple styles on an element.

```svelte
<!-- These are equivalent -->
<div style:color="red">...</div>
<div style="color: red;">...</div>
```

The value can contain arbitrary expressions:

```svelte
<div style:color={myColor}>...</div>
```

The shorthand form is allowed:

```svelte
<div style:color>...</div>
```

Multiple styles can be set on a single element:

```svelte
<div style:color style:width="12rem" style:background-color={darkMode ? 'black' : 'white'}>...</div>
```

To mark a style as important, use the `|important` modifier:

```svelte
<div style:color|important="red">...</div>
```

When `style:` directives are combined with `style` attributes, the directives will take precedence:

```svelte
<div style="color: blue;" style:color="red">This will be red</div>
```

## Control flow

- if
- each
- await (or move that into some kind of data loading section?)
- NOT: key (move into transition section, because that's the common use case)

Svelte augments HTML with control flow blocks to be able to express conditionally rendered content or lists.

The syntax between these blocks is the same:

- `{#` denotes the start of a block
- `{:` denotes a different branch part of the block. Depending on the block, there can be multiple of these
- `{/` denotes the end of a block

## {#if ...}

## {#each ...}

```svelte
<!--- copy: false  --->
{#each expression as name}...{/each}
```

```svelte
<!--- copy: false  --->
{#each expression as name, index}...{/each}
```

```svelte
<!--- copy: false  --->
{#each expression as name (key)}...{/each}
```

```svelte
<!--- copy: false  --->
{#each expression as name, index (key)}...{/each}
```

```svelte
<!--- copy: false  --->
{#each expression as name}...{:else}...{/each}
```

Iterating over lists of values can be done with an each block.

```svelte
<h1>Shopping list</h1>
<ul>
  {#each items as item}
    <li>{item.name} x {item.qty}</li>
  {/each}
</ul>
```

You can use each blocks to iterate over any array or array-like value — that is, any object with a `length` property.

An each block can also specify an _index_, equivalent to the second argument in an `array.map(...)` callback:

```svelte
{#each items as item, i}
  <li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

If a _key_ expression is provided — which must uniquely identify each list item — Svelte will use it to diff the list when data changes, rather than adding or removing items at the end. The key can be any object, but strings and numbers are recommended since they allow identity to persist when the objects themselves change.

```svelte
{#each items as item (item.id)}
  <li>{item.name} x {item.qty}</li>
{/each}

<!-- or with additional index value -->
{#each items as item, i (item.id)}
  <li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

You can freely use destructuring and rest patterns in each blocks.

```svelte
{#each items as { id, name, qty }, i (id)}
  <li>{i + 1}: {name} x {qty}</li>
{/each}

{#each objects as { id, ...rest }}
  <li><span>{id}</span><MyComponent {...rest} /></li>
{/each}

{#each items as [id, ...rest]}
  <li><span>{id}</span><MyComponent values={rest} /></li>
{/each}
```

An each block can also have an `{:else}` clause, which is rendered if the list is empty.

```svelte
{#each todos as todo}
  <p>{todo.text}</p>
{:else}
  <p>No tasks today!</p>
{/each}
```

It is possible to iterate over iterables like `Map` or `Set`. Iterables need to be finite and static (they shouldn't change while being iterated over). Under the hood, they are transformed to an array using `Array.from` before being passed off to rendering. If you're writing performance-sensitive code, try to avoid iterables and use regular arrays as they are more performant.

## Other block types

Svelte also provides [`#snippet`](snippets), [`#key`](transitions-and-animations) and [`#await`](data-fetching) blocks. You can find out more about them in their respective sections.

## Data fetching

Fetching data is a fundamental part of apps interacting with the outside world. Svelte is unopinionated with how you fetch your data. The simplest way would be using the built-in `fetch` method:

```svelte
<script>
  let response = $state();
  fetch('/api/data').then(async (r) => (response = r.json()));
</script>
```

While this works, it makes working with promises somewhat unergonomic. Svelte alleviates this problem using the `#await` block.

## {#await ...}

## SvelteKit loaders

Fetching inside your components is great for simple use cases, but it's prone to data loading waterfalls and makes code harder to work with because of the promise handling. SvelteKit solves this problem by providing a opinionated data loading story that is coupled to its router. Learn more about it [in the docs](../kit).
# Advanced

## Advanced routing

## Rest parameters

If the number of route segments is unknown, you can use rest syntax — for example you might implement GitHub's file viewer like so...

```bash
/[org]/[repo]/tree/[branch]/[...file]
```

...in which case a request for `/sveltejs/kit/tree/main/documentation/docs/04-advanced-routing.md` would result in the following parameters being available to the page:

```js
// @noErrors
{
  org: 'sveltejs',
  repo: 'kit',
  branch: 'main',
  file: 'documentation/docs/04-advanced-routing.md'
}
```

> [!NOTE] `src/routes/a/[...rest]/z/+page.svelte` will match `/a/z` (i.e. there's no parameter at all) as well as `/a/b/z` and `/a/b/c/z` and so on. Make sure you check that the value of the rest parameter is valid, for example using a [matcher](#Matching).

### 404 pages

Rest parameters also allow you to render custom 404s. Given these routes...

```tree
src/routes/
├ marx-brothers/
│ ├ chico/
│ ├ harpo/
│ ├ groucho/
│ └ +error.svelte
└ +error.svelte
```

...the `marx-brothers/+error.svelte` file will _not_ be rendered if you visit `/marx-brothers/karl`, because no route was matched. If you want to render the nested error page, you should create a route that matches any `/marx-brothers/*` request, and return a 404 from it:

```tree
src/routes/
├ marx-brothers/
+++| ├ [...path]/+++
│ ├ chico/
│ ├ harpo/
│ ├ groucho/
│ └ +error.svelte
└ +error.svelte
```

```js
/// file: src/routes/marx-brothers/[...path]/+page.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load(event) {
  error(404, 'Not Found');
}
```

> [!NOTE] If you don't handle 404 cases, they will appear in [`handleError`](hooks#Shared-hooks-handleError)

## Optional parameters

A route like `[lang]/home` contains a parameter named `lang` which is required. Sometimes it's beneficial to make these parameters optional, so that in this example both `home` and `en/home` point to the same page. You can do that by wrapping the parameter in another bracket pair: `[[lang]]/home`

Note that an optional route parameter cannot follow a rest parameter (`[...rest]/[[optional]]`), since parameters are matched 'greedily' and the optional parameter would always be unused.

## Matching

A route like `src/routes/fruits/[page]` would match `/fruits/apple`, but it would also match `/fruits/rocketship`. We don't want that. You can ensure that route parameters are well-formed by adding a _matcher_ — which takes the parameter string (`"apple"` or `"rocketship"`) and returns `true` if it is valid — to your [`params`](configuration#files) directory...

```js
/// file: src/params/fruit.js
/**
 * @param {string} param
 * @return {param is ('apple' | 'orange')}
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param) {
  return param === 'apple' || param === 'orange';
}
```

...and augmenting your routes:

```
src/routes/fruits/[page+++=fruit+++]
```

If the pathname doesn't match, SvelteKit will try to match other routes (using the sort order specified below), before eventually returning a 404.

Each module in the `params` directory corresponds to a matcher, with the exception of `*.test.js` and `*.spec.js` files which may be used to unit test your matchers.

> [!NOTE] Matchers run both on the server and in the browser.

## Sorting

It's possible for multiple routes to match a given path. For example each of these routes would match `/foo-abc`:

```bash
src/routes/[...catchall]/+page.svelte
src/routes/[[a=x]]/+page.svelte
src/routes/[b]/+page.svelte
src/routes/foo-[c]/+page.svelte
src/routes/foo-abc/+page.svelte
```

SvelteKit needs to know which route is being requested. To do so, it sorts them according to the following rules...

- More specific routes are higher priority (e.g. a route with no parameters is more specific than a route with one dynamic parameter, and so on)
- Parameters with [matchers](#Matching) (`[name=type]`) are higher priority than those without (`[name]`)
- `[[optional]]` and `[...rest]` parameters are ignored unless they are the final part of the route, in which case they are treated with lowest priority. In other words `x/[[y]]/z` is treated equivalently to `x/z` for the purposes of sorting
- Ties are resolved alphabetically

...resulting in this ordering, meaning that `/foo-abc` will invoke `src/routes/foo-abc/+page.svelte`, and `/foo-def` will invoke `src/routes/foo-[c]/+page.svelte` rather than less specific routes:

```bash
src/routes/foo-abc/+page.svelte
src/routes/foo-[c]/+page.svelte
src/routes/[[a=x]]/+page.svelte
src/routes/[b]/+page.svelte
src/routes/[...catchall]/+page.svelte
```

## Encoding

Some characters can't be used on the filesystem — `/` on Linux and Mac, `\ / : * ? " < > |` on Windows. The `#` and `%` characters have special meaning in URLs, and the `[ ] ( )` characters have special meaning to SvelteKit, so these also can't be used directly as part of your route.

To use these characters in your routes, you can use hexadecimal escape sequences, which have the format `[x+nn]` where `nn` is a hexadecimal character code:

- `\` — `[x+5c]`
- `/` — `[x+2f]`
- `:` — `[x+3a]`
- `*` — `[x+2a]`
- `?` — `[x+3f]`
- `"` — `[x+22]`
- `<` — `[x+3c]`
- `>` — `[x+3e]`
- `|` — `[x+7c]`
- `#` — `[x+23]`
- `%` — `[x+25]`
- `[` — `[x+5b]`
- `]` — `[x+5d]`
- `(` — `[x+28]`
- `)` — `[x+29]`

For example, to create a `/smileys/:-)` route, you would create a `src/routes/smileys/[x+3a]-[x+29]/+page.svelte` file.

You can determine the hexadecimal code for a character with JavaScript:

```js
':'.charCodeAt(0).toString(16); // '3a', hence '[x+3a]'
```

You can also use Unicode escape sequences. Generally you won't need to as you can use the unencoded character directly, but if — for some reason — you can't have a filename with an emoji in it, for example, then you can use the escaped characters. In other words, these are equivalent:

```
src/routes/[u+d83e][u+dd2a]/+page.svelte
src/routes/🤪/+page.svelte
```

The format for a Unicode escape sequence is `[u+nnnn]` where `nnnn` is a valid value between `0000` and `10ffff`. (Unlike JavaScript string escaping, there's no need to use surrogate pairs to represent code points above `ffff`.) To learn more about Unicode encodings, consult [Programming with Unicode](https://unicodebook.readthedocs.io/unicode_encodings.html).

> [!NOTE] Since TypeScript [struggles](https://github.com/microsoft/TypeScript/issues/13399) with directories with a leading `.` character, you may find it useful to encode these characters when creating e.g. [`.well-known`](https://en.wikipedia.org/wiki/Well-known_URI) routes: `src/routes/[x+2e]well-known/...`

## Advanced layouts

By default, the _layout hierarchy_ mirrors the _route hierarchy_. In some cases, that might not be what you want.

### (group)

Perhaps you have some routes that are 'app' routes that should have one layout (e.g. `/dashboard` or `/item`), and others that are 'marketing' routes that should have a different layout (`/about` or `/testimonials`). We can group these routes with a directory whose name is wrapped in parentheses — unlike normal directories, `(app)` and `(marketing)` do not affect the URL pathname of the routes inside them:

```tree
src/routes/
+++│ (app)/+++
│ ├ dashboard/
│ ├ item/
│ └ +layout.svelte
+++│ (marketing)/+++
│ ├ about/
│ ├ testimonials/
│ └ +layout.svelte
├ admin/
└ +layout.svelte
```

You can also put a `+page` directly inside a `(group)`, for example if `/` should be an `(app)` or a `(marketing)` page.

### Breaking out of layouts

The root layout applies to every page of your app — if omitted, it defaults to `{@render children()}`. If you want some pages to have a different layout hierarchy than the rest, then you can put your entire app inside one or more groups _except_ the routes that should not inherit the common layouts.

In the example above, the `/admin` route does not inherit either the `(app)` or `(marketing)` layouts.

### +page@

Pages can break out of the current layout hierarchy on a route-by-route basis. Suppose we have an `/item/[id]/embed` route inside the `(app)` group from the previous example:

```tree
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
+++│ │ │ │ └ +page.svelte+++
│ │ │ └ +layout.svelte
│ │ └ +layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

Ordinarily, this would inherit the root layout, the `(app)` layout, the `item` layout and the `[id]` layout. We can reset to one of those layouts by appending `@` followed by the segment name — or, for the root layout, the empty string. In this example, we can choose from the following options:

- `+page@[id].svelte` - inherits from `src/routes/(app)/item/[id]/+layout.svelte`
- `+page@item.svelte` - inherits from `src/routes/(app)/item/+layout.svelte`
- `+page@(app).svelte` - inherits from `src/routes/(app)/+layout.svelte`
- `+page@.svelte` - inherits from `src/routes/+layout.svelte`

```tree
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
+++│ │ │ │ └ +page@(app).svelte+++
│ │ │ └ +layout.svelte
│ │ └ +layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

### +layout@

Like pages, layouts can _themselves_ break out of their parent layout hierarchy, using the same technique. For example, a `+layout@.svelte` component would reset the hierarchy for all its child routes.

```
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
│ │ │ │ └ +page.svelte  // uses (app)/item/[id]/+layout.svelte
│ │ │ ├ +layout.svelte  // inherits from (app)/item/+layout@.svelte
│ │ │ └ +page.svelte    // uses (app)/item/+layout@.svelte
│ │ └ +layout@.svelte   // inherits from root layout, skipping (app)/+layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

### When to use layout groups

Not all use cases are suited for layout grouping, nor should you feel compelled to use them. It might be that your use case would result in complex `(group)` nesting, or that you don't want to introduce a `(group)` for a single outlier. It's perfectly fine to use other means such as composition (reusable `load` functions or Svelte components) or if-statements to achieve what you want. The following example shows a layout that rewinds to the root layout and reuses components and functions that other layouts can also use:

```svelte
<!--- file: src/routes/nested/route/+layout@.svelte --->
<script>
  import ReusableLayout from '$lib/ReusableLayout.svelte';
  let { data, children } = $props();
</script>

<ReusableLayout {data}>
  {@render children()}
</ReusableLayout>
```

```js
/// file: src/routes/nested/route/+layout.js
// @filename: ambient.d.ts
declare module "$lib/reusable-load-function" {
  export function reusableLoad(event: import('@sveltejs/kit').LoadEvent): Promise<Record<string, any>>;
}
// @filename: index.js
// ---cut---
import { reusableLoad } from '$lib/reusable-load-function';

/** @type {import('./$types').PageLoad} */
export function load(event) {
  // Add additional logic here, if needed
  return reusableLoad(event);
}
```

## Hooks


'Hooks' are app-wide functions you declare that SvelteKit will call in response to specific events, giving you fine-grained control over the framework's behaviour.

There are three hooks files, all optional:

- `src/hooks.server.js` — your app's server hooks
- `src/hooks.client.js` — your app's client hooks
- `src/hooks.js` — your app's hooks that run on both the client and server

Code in these modules will run when the application starts up, making them useful for initializing database clients and so on.

> [!NOTE] You can configure the location of these files with [`config.kit.files.hooks`](configuration#files).

## Server hooks

The following hooks can be added to `src/hooks.server.js`:

### handle

This function runs every time the SvelteKit server receives a [request](web-standards#Fetch-APIs-Request) — whether that happens while the app is running, or during [prerendering](page-options#prerender) — and determines the [response](web-standards#Fetch-APIs-Response). It receives an `event` object representing the request and a function called `resolve`, which renders the route and generates a `Response`. This allows you to modify response headers or bodies, or bypass SvelteKit entirely (for implementing routes programmatically, for example).

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (event.url.pathname.startsWith('/custom')) {
    return new Response('custom response');
  }

  const response = await resolve(event);
  return response;
}
```

> [!NOTE] Requests for static assets — which includes pages that were already prerendered — are _not_ handled by SvelteKit.

If unimplemented, defaults to `({ event, resolve }) => resolve(event)`.

### locals

To add custom data to the request, which is passed to handlers in `+server.js` and server `load` functions, populate the `event.locals` object, as shown below.

```js
/// file: src/hooks.server.js
// @filename: ambient.d.ts
type User = {
  name: string;
}

declare namespace App {
  interface Locals {
    user: User;
  }
}

const getUserInformation: (cookie: string | void) => Promise<User>;

// @filename: index.js
// ---cut---
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  event.locals.user = await getUserInformation(event.cookies.get('sessionid'));

  const response = await resolve(event);
  response.headers.set('x-custom-header', 'potato');

  return response;
}
```

You can define multiple `handle` functions and execute them with [the `sequence` helper function](@sveltejs-kit-hooks).

`resolve` also supports a second, optional parameter that gives you more control over how the response will be rendered. That parameter is an object that can have the following fields:

- `transformPageChunk(opts: { html: string, done: boolean }): MaybePromise<string | undefined>` — applies custom transforms to HTML. If `done` is true, it's the final chunk. Chunks are not guaranteed to be well-formed HTML (they could include an element's opening tag but not its closing tag, for example) but they will always be split at sensible boundaries such as `%sveltekit.head%` or layout/page components.
- `filterSerializedResponseHeaders(name: string, value: string): boolean` — determines which headers should be included in serialized responses when a `load` function loads a resource with `fetch`. By default, none will be included.
- `preload(input: { type: 'js' | 'css' | 'font' | 'asset', path: string }): boolean` — determines what files should be added to the `<head>` tag to preload it. The method is called with each file that was found at build time while constructing the code chunks — so if you for example have `import './styles.css` in your `+page.svelte`, `preload` will be called with the resolved path to that CSS file when visiting that page. Note that in dev mode `preload` is _not_ called, since it depends on analysis that happens at build time. Preloading can improve performance by downloading assets sooner, but it can also hurt if too much is downloaded unnecessarily. By default, `js` and `css` files will be preloaded. `asset` files are not preloaded at all currently, but we may add this later after evaluating feedback.

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('old', 'new'),
    filterSerializedResponseHeaders: (name) => name.startsWith('x-'),
    preload: ({ type, path }) => type === 'js' || path.includes('/important/')
  });

  return response;
}
```

Note that `resolve(...)` will never throw an error, it will always return a `Promise<Response>` with the appropriate status code. If an error is thrown elsewhere during `handle`, it is treated as fatal, and SvelteKit will respond with a JSON representation of the error or a fallback error page — which can be customised via `src/error.html` — depending on the `Accept` header. You can read more about error handling [here](errors).

### handleFetch

This function allows you to modify (or replace) a `fetch` request that happens inside a `load` or `action` function that runs on the server (or during pre-rendering).

For example, your `load` function might make a request to a public URL like `https://api.yourapp.com` when the user performs a client-side navigation to the respective page, but during SSR it might make sense to hit the API directly (bypassing whatever proxies and load balancers sit between it and the public internet).

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ request, fetch }) {
  if (request.url.startsWith('https://api.yourapp.com/')) {
    // clone the original request, but change the URL
    request = new Request(
      request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
      request
    );
  }

  return fetch(request);
}
```

**Credentials**

For same-origin requests, SvelteKit's `fetch` implementation will forward `cookie` and `authorization` headers unless the `credentials` option is set to `"omit"`.

For cross-origin requests, `cookie` will be included if the request URL belongs to a subdomain of the app — for example if your app is on `my-domain.com`, and your API is on `api.my-domain.com`, cookies will be included in the request.

If your app and your API are on sibling subdomains — `www.my-domain.com` and `api.my-domain.com` for example — then a cookie belonging to a common parent domain like `my-domain.com` will _not_ be included, because SvelteKit has no way to know which domain the cookie belongs to. In these cases you will need to manually include the cookie using `handleFetch`:

```js
/// file: src/hooks.server.js
// @errors: 2345
/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ event, request, fetch }) {
  if (request.url.startsWith('https://api.my-domain.com/')) {
    request.headers.set('cookie', event.request.headers.get('cookie'));
  }

  return fetch(request);
}
```

## Shared hooks

The following can be added to `src/hooks.server.js` _and_ `src/hooks.client.js`:

### handleError

If an [unexpected error](errors#Unexpected-errors) is thrown during loading or rendering, this function will be called with the `error`, `event`, `status` code and `message`. This allows for two things:

- you can log the error
- you can generate a custom representation of the error that is safe to show to users, omitting sensitive details like messages and stack traces. The returned value, which defaults to `{ message }`, becomes the value of `$page.error`.

For errors thrown from your code (or library code called by your code) the status will be 500 and the message will be "Internal Error". While `error.message` may contain sensitive information that should not be exposed to users, `message` is safe (albeit meaningless to the average user).

To add more information to the `$page.error` object in a type-safe way, you can customize the expected shape by declaring an `App.Error` interface (which must include `message: string`, to guarantee sensible fallback behavior). This allows you to — for example — append a tracking ID for users to quote in correspondence with your technical support staff:

```ts
/// file: src/app.d.ts
declare global {
  namespace App {
    interface Error {
      message: string;
      errorId: string;
    }
  }
}

export {};
```

```js
/// file: src/hooks.server.js
// @errors: 2322 2353
// @filename: ambient.d.ts
declare module '@sentry/sveltekit' {
  export const init: (opts: any) => void;
  export const captureException: (error: any, opts: any) => void;
}

// @filename: index.js
// ---cut---
import * as Sentry from '@sentry/sveltekit';

Sentry.init({/*...*/})

/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, event, status, message }) {
  const errorId = crypto.randomUUID();

  // example integration with https://sentry.io/
  Sentry.captureException(error, {
    extra: { event, errorId, status }
  });

  return {
    message: 'Whoops!',
    errorId
  };
}
```

```js
/// file: src/hooks.client.js
// @errors: 2322 2353
// @filename: ambient.d.ts
declare module '@sentry/sveltekit' {
  export const init: (opts: any) => void;
  export const captureException: (error: any, opts: any) => void;
}

// @filename: index.js
// ---cut---
import * as Sentry from '@sentry/sveltekit';

Sentry.init({/*...*/})

/** @type {import('@sveltejs/kit').HandleClientError} */
export async function handleError({ error, event, status, message }) {
  const errorId = crypto.randomUUID();

  // example integration with https://sentry.io/
  Sentry.captureException(error, {
    extra: { event, errorId, status }
  });

  return {
    message: 'Whoops!',
    errorId
  };
}
```

> [!NOTE] In `src/hooks.client.js`, the type of `handleError` is `HandleClientError` instead of `HandleServerError`, and `event` is a `NavigationEvent` rather than a `RequestEvent`.

This function is not called for _expected_ errors (those thrown with the [`error`](@sveltejs-kit#error) function imported from `@sveltejs/kit`).

During development, if an error occurs because of a syntax error in your Svelte code, the passed in error has a `frame` property appended highlighting the location of the error.

> [!NOTE] Make sure that `handleError` _never_ throws an error

## Universal hooks

The following can be added to `src/hooks.js`. Universal hooks run on both server and client (not to be confused with shared hooks, which are environment-specific).

### reroute

This function runs before `handle` and allows you to change how URLs are translated into routes. The returned pathname (which defaults to `url.pathname`) is used to select the route and its parameters.

For example, you might have a `src/routes/[[lang]]/about/+page.svelte` page, which should be accessible as `/en/about` or `/de/ueber-uns` or `/fr/a-propos`. You could implement this with `reroute`:

```js
/// file: src/hooks.js
// @errors: 2345
// @errors: 2304

/** @type {Record<string, string>} */
const translated = {
  '/en/about': '/en/about',
  '/de/ueber-uns': '/de/about',
  '/fr/a-propos': '/fr/about',
};

/** @type {import('@sveltejs/kit').Reroute} */
export function reroute({ url }) {
  if (url.pathname in translated) {
    return translated[url.pathname];
  }
}
```

The `lang` parameter will be correctly derived from the returned pathname.

Using `reroute` will _not_ change the contents of the browser's address bar, or the value of `event.url`.

## Errors

Errors are an inevitable fact of software development. SvelteKit handles errors differently depending on where they occur, what kind of errors they are, and the nature of the incoming request.

## Error objects

SvelteKit distinguishes between expected and unexpected errors, both of which are represented as simple `{ message: string }` objects by default.

You can add additional properties, like a `code` or a tracking `id`, as shown in the examples below. (When using TypeScript this requires you to redefine the `Error` type as described in  [type safety](errors#Type-safety)).

## Expected errors

An _expected_ error is one created with the [`error`](@sveltejs-kit#error) helper imported from `@sveltejs/kit`:

```js
/// file: src/routes/blog/[slug]/+page.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
  export function getPost(slug: string): Promise<{ title: string, content: string } | undefined>
}

// @filename: index.js
// ---cut---
import { error } from '@sveltejs/kit';
import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const post = await db.getPost(params.slug);

  if (!post) {
    error(404, {
      message: 'Not found'
    });
  }

  return { post };
}
```

This throws an exception that SvelteKit catches, causing it to set the response status code to 404 and render an [`+error.svelte`](routing#error) component, where `$page.error` is the object provided as the second argument to `error(...)`.

```svelte
<!--- file: src/routes/+error.svelte --->
<script>
  import { page } from '$app/stores';
</script>

<h1>{$page.error.message}</h1>
```

You can add extra properties to the error object if needed...

```js
import { error } from '@sveltejs/kit';

declare global {
  namespace App {
    interface Error {
      message: string;
      code: string;
    }
  }
}

// ---cut---
error(404, {
  message: 'Not found',
  +++code: 'NOT_FOUND'+++
});
```

...otherwise, for convenience, you can pass a string as the second argument:

```js
import { error } from '@sveltejs/kit';
// ---cut---
---error(404, { message: 'Not found' });---
+++error(404, 'Not found');+++
```

> [!NOTE] [In SvelteKit 1.x](migrating-to-sveltekit-2#redirect-and-error-are-no-longer-thrown-by-you) you had to `throw` the `error` yourself

## Unexpected errors

An _unexpected_ error is any other exception that occurs while handling a request. Since these can contain sensitive information, unexpected error messages and stack traces are not exposed to users.

By default, unexpected errors are printed to the console (or, in production, your server logs), while the error that is exposed to the user has a generic shape:

```json
{ "message": "Internal Error" }
```

Unexpected errors will go through the [`handleError`](hooks#Shared-hooks-handleError) hook, where you can add your own error handling — for example, sending errors to a reporting service, or returning a custom error object which becomes `$page.error`.

## Responses

If an error occurs inside `handle` or inside a [`+server.js`](routing#server) request handler, SvelteKit will respond with either a fallback error page or a JSON representation of the error object, depending on the request's `Accept` headers.

You can customise the fallback error page by adding a `src/error.html` file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>%sveltekit.error.message%</title>
  </head>
  <body>
    <h1>My custom error page</h1>
    <p>Status: %sveltekit.status%</p>
    <p>Message: %sveltekit.error.message%</p>
  </body>
</html>
```

SvelteKit will replace `%sveltekit.status%` and `%sveltekit.error.message%` with their corresponding values.

If the error instead occurs inside a `load` function while rendering a page, SvelteKit will render the [`+error.svelte`](routing#error) component nearest to where the error occurred. If the error occurs inside a `load` function in `+layout(.server).js`, the closest error boundary in the tree is an `+error.svelte` file _above_ that layout (not next to it).

The exception is when the error occurs inside the root `+layout.js` or `+layout.server.js`, since the root layout would ordinarily _contain_ the `+error.svelte` component. In this case, SvelteKit uses the fallback error page.

## Type safety

If you're using TypeScript and need to customize the shape of errors, you can do so by declaring an `App.Error` interface in your app (by convention, in `src/app.d.ts`, though it can live anywhere that TypeScript can 'see'):

```dts
/// file: src/app.d.ts
declare global {
  namespace App {
    interface Error {
+++			code: string;
      id: string;+++
    }
  }
}

export {};
```

This interface always includes a `message: string` property.


## Link options

In SvelteKit, `<a>` elements (rather than framework-specific `<Link>` components) are used to navigate between the routes of your app. If the user clicks on a link whose `href` is 'owned' by the app (as opposed to, say, a link to an external site) then SvelteKit will navigate to the new page by importing its code and then calling any `load` functions it needs to fetch data.

You can customise the behaviour of links with `data-sveltekit-*` attributes. These can be applied to the `<a>` itself, or to a parent element.

These options also apply to `<form>` elements with [`method="GET"`](form-actions#GET-vs-POST).

## data-sveltekit-preload-data

Before the browser registers that the user has clicked on a link, we can detect that they've hovered the mouse over it (on desktop) or that a `touchstart` or `mousedown` event was triggered. In both cases, we can make an educated guess that a `click` event is coming.

SvelteKit can use this information to get a head start on importing the code and fetching the page's data, which can give us an extra couple of hundred milliseconds — the difference between a user interface that feels laggy and one that feels snappy.

We can control this behaviour with the `data-sveltekit-preload-data` attribute, which can have one of two values:

- `"hover"` means that preloading will start if the mouse comes to a rest over a link. On mobile, preloading begins on `touchstart`
- `"tap"` means that preloading will start as soon as a `touchstart` or `mousedown` event is registered

The default project template has a `data-sveltekit-preload-data="hover"` attribute applied to the `<body>` element in `src/app.html`, meaning that every link is preloaded on hover by default:

```html
<body data-sveltekit-preload-data="hover">
  <div style="display: contents">%sveltekit.body%</div>
</body>
```

Sometimes, calling `load` when the user hovers over a link might be undesirable, either because it's likely to result in false positives (a click needn't follow a hover) or because data is updating very quickly and a delay could mean staleness.

In these cases, you can specify the `"tap"` value, which causes SvelteKit to call `load` only when the user taps or clicks on a link:

```html
<a data-sveltekit-preload-data="tap" href="/stonks">
  Get current stonk values
</a>
```

> [!NOTE] You can also programmatically invoke `preloadData` from `$app/navigation`.

Data will never be preloaded if the user has chosen reduced data usage, meaning [`navigator.connection.saveData`](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData) is `true`.

## data-sveltekit-preload-code

Even in cases where you don't want to preload _data_ for a link, it can be beneficial to preload the _code_. The `data-sveltekit-preload-code` attribute works similarly to `data-sveltekit-preload-data`, except that it can take one of four values, in decreasing 'eagerness':

- `"eager"` means that links will be preloaded straight away
- `"viewport"` means that links will be preloaded once they enter the viewport
- `"hover"` - as above, except that only code is preloaded
- `"tap"` - as above, except that only code is preloaded

Note that `viewport` and `eager` only apply to links that are present in the DOM immediately following navigation — if a link is added later (in an `{#if ...}` block, for example) it will not be preloaded until triggered by `hover` or `tap`. This is to avoid performance pitfalls resulting from aggressively observing the DOM for changes.

> [!NOTE] Since preloading code is a prerequisite for preloading data, this attribute will only have an effect if it specifies a more eager value than any `data-sveltekit-preload-data` attribute that is present.

As with `data-sveltekit-preload-data`, this attribute will be ignored if the user has chosen reduced data usage.

## data-sveltekit-reload

Occasionally, we need to tell SvelteKit not to handle a link, but allow the browser to handle it. Adding a `data-sveltekit-reload` attribute to a link...

```html
<a data-sveltekit-reload href="/path">Path</a>
```

...will cause a full-page navigation when the link is clicked.

Links with a `rel="external"` attribute will receive the same treatment. In addition, they will be ignored during [prerendering](page-options#prerender).

## data-sveltekit-replacestate

Sometimes you don't want navigation to create a new entry in the browser's session history. Adding a `data-sveltekit-replacestate` attribute to a link...

```html
<a data-sveltekit-replacestate href="/path">Path</a>
```

...will replace the current `history` entry rather than creating a new one with `pushState` when the link is clicked.

## data-sveltekit-keepfocus

Sometimes you don't want [focus to be reset](accessibility#Focus-management) after navigation. For example, maybe you have a search form that submits as the user is typing, and you want to keep focus on the text input.  Adding a `data-sveltekit-keepfocus` attribute to it...

```html
<form data-sveltekit-keepfocus>
  <input type="text" name="query">
</form>
```

...will cause the currently focused element to retain focus after navigation. In general, avoid using this attribute on links, since the focused element would be the `<a>` tag (and not a previously focused element) and screen reader and other assistive technology users often expect focus to be moved after a navigation. You should also only use this attribute on elements that still exist after navigation. If the element no longer exists, the user's focus will be lost, making for a confusing experience for assistive technology users.

## data-sveltekit-noscroll

When navigating to internal links, SvelteKit mirrors the browser's default navigation behaviour: it will change the scroll position to 0,0 so that the user is at the very top left of the page (unless the link includes a `#hash`, in which case it will scroll to the element with a matching ID).

In certain cases, you may wish to disable this behaviour. Adding a `data-sveltekit-noscroll` attribute to a link...

```html
<a href="path" data-sveltekit-noscroll>Path</a>
```

...will prevent scrolling after the link is clicked.

## Disabling options

To disable any of these options inside an element where they have been enabled, use the `"false"` value:

```html
<div data-sveltekit-preload-data>
  <!-- these links will be preloaded -->
  <a href="/a">a</a>
  <a href="/b">b</a>
  <a href="/c">c</a>

  <div data-sveltekit-preload-data="false">
    <!-- these links will NOT be preloaded -->
    <a href="/d">d</a>
    <a href="/e">e</a>
    <a href="/f">f</a>
  </div>
</div>
```

To apply an attribute to an element conditionally, do this:

```svelte
<div data-sveltekit-preload-data={condition ? 'hover' : false}>
```

## Service workers

Service workers act as proxy servers that handle network requests inside your app. This makes it possible to make your app work offline, but even if you don't need offline support (or can't realistically implement it because of the type of app you're building), it's often worth using service workers to speed up navigation by precaching your built JS and CSS.

In SvelteKit, if you have a `src/service-worker.js` file (or `src/service-worker/index.js`) it will be bundled and automatically registered. You can change the [location of your service worker](configuration#files) if you need to.

You can [disable automatic registration](configuration#serviceWorker) if you need to register the service worker with your own logic or use another solution. The default registration looks something like this:

```js
if ('serviceWorker' in navigator) {
  addEventListener('load', function () {
    navigator.serviceWorker.register('./path/to/service-worker.js');
  });
}
```

## Inside the service worker

Inside the service worker you have access to the [`$service-worker` module]($service-worker), which provides you with the paths to all static assets, build files and prerendered pages. You're also provided with an app version string, which you can use for creating a unique cache name, and the deployment's `base` path. If your Vite config specifies `define` (used for global variable replacements), this will be applied to service workers as well as your server/client builds.

The following example caches the built app and any files in `static` eagerly, and caches all other requests as they happen. This would make each page work offline once visited.

```js
// @errors: 2339
/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
  ...build, // the app itself
  ...files  // everything in `static`
];

self.addEventListener('install', (event) => {
  // Create a new cache and add all files to it
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
  // Remove previous cached data from disk
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
  // ignore POST requests etc
  if (event.request.method !== 'GET') return;

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // `build`/`files` can always be served from the cache
    if (ASSETS.includes(url.pathname)) {
      const response = await cache.match(url.pathname);

      if (response) {
        return response;
      }
    }

    // for everything else, try the network first, but
    // fall back to the cache if we're offline
    try {
      const response = await fetch(event.request);

      // if we're offline, fetch can return a value that is not a Response
      // instead of throwing - and we can't pass this non-Response to respondWith
      if (!(response instanceof Response)) {
        throw new Error('invalid response from fetch');
      }

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch (err) {
      const response = await cache.match(event.request);

      if (response) {
        return response;
      }

      // if there's no cache, then just error out
      // as there is nothing we can do to respond to this request
      throw err;
    }
  }

  event.respondWith(respond());
});
```

> [!NOTE] Be careful when caching! In some cases, stale data might be worse than data that's unavailable while offline. Since browsers will empty caches if they get too full, you should also be careful about caching large assets like video files.

## During development

The service worker is bundled for production, but not during development. For that reason, only browsers that support [modules in service workers](https://web.dev/es-modules-in-sw) will be able to use them at dev time. If you are manually registering your service worker, you will need to pass the `{ type: 'module' }` option in development:

```js
import { dev } from '$app/environment';

navigator.serviceWorker.register('/service-worker.js', {
  type: dev ? 'module' : 'classic'
});
```

> [!NOTE] `build` and `prerendered` are empty arrays during development

## Type safety

Setting up proper types for service workers requires some manual setup. Inside your `service-worker.js`, add the following to the top of your file:

```original-js
/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));
```
```generated-ts
/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;
```

This disables access to DOM typings like `HTMLElement` which are not available inside a service worker and instantiates the correct globals. The reassignment of `self` to `sw` allows you to type cast it in the process (there are a couple of ways to do this, but this is the easiest that requires no additional files). Use `sw` instead of `self` in the rest of the file. The reference to the SvelteKit types ensures that the `$service-worker` import has proper type definitions. If you import `$env/static/public` you either have to `// @ts-ignore` the import or add `/// <reference types="../.svelte-kit/ambient.d.ts" />` to the reference types.

## Other solutions

SvelteKit's service worker implementation is deliberately low-level. If you need a more full-fledged but also more opinionated solution, we recommend looking at solutions like [Vite PWA plugin](https://vite-pwa-org.netlify.app/frameworks/sveltekit.html), which uses [Workbox](https://web.dev/learn/pwa/workbox). For more general information on service workers, we recommend [the MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

## Server-only modules

Like a good friend, SvelteKit keeps your secrets. When writing your backend and frontend in the same repository, it can be easy to accidentally import sensitive data into your front-end code (environment variables containing API keys, for example). SvelteKit provides a way to prevent this entirely: server-only modules.

## Private environment variables

The [`$env/static/private`]($env-static-private) and [`$env/dynamic/private`]($env-dynamic-private) modules can only be imported into modules that only run on the server, such as [`hooks.server.js`](hooks#Server-hooks) or [`+page.server.js`](routing#page-page.server.js).

## Server-only utilities

The [`$app/server`]($app-server) module, which contains a `read` function for reading assets from the filesystem, can likewise only be imported by code that runs on the server.

## Your modules

You can make your own modules server-only in two ways:

- adding `.server` to the filename, e.g. `secrets.server.js`
- placing them in `$lib/server`, e.g. `$lib/server/secrets.js`

## How it works

Any time you have public-facing code that imports server-only code (whether directly or indirectly)...

```js
// @errors: 7005
/// file: $lib/server/secrets.js
export const atlantisCoordinates = [/* redacted */];
```

```js
// @errors: 2307 7006 7005
/// file: src/routes/utils.js
export { atlantisCoordinates } from '$lib/server/secrets.js';

export const add = (a, b) => a + b;
```

```html
/// file: src/routes/+page.svelte
<script>
  import { add } from './utils.js';
</script>
```

...SvelteKit will error:

```
Cannot import $lib/server/secrets.js into public-facing code:
- src/routes/+page.svelte
  - src/routes/utils.js
    - $lib/server/secrets.js
```

Even though the public-facing code — `src/routes/+page.svelte` — only uses the `add` export and not the secret `atlantisCoordinates` export, the secret code could end up in JavaScript that the browser downloads, and so the import chain is considered unsafe.

This feature also works with dynamic imports, even interpolated ones like ``await import(`./${foo}.js`)``, with one small caveat: during development, if there are two or more dynamic imports between the public-facing code and the server-only module, the illegal import will not be detected the first time the code is loaded.

> [!NOTE] Unit testing frameworks like Vitest do not distinguish between server-only and public-facing code. For this reason, illegal import detection is disabled when running tests, as determined by `process.env.TEST === 'true'`.

## Snapshots

Ephemeral DOM state — like scroll positions on sidebars, the content of `<input>` elements and so on — is discarded when you navigate from one page to another.

For example, if the user fills out a form but navigates away and then back before submitting, or if the user refreshes the page, the values they filled in will be lost. In cases where it's valuable to preserve that input, you can take a _snapshot_ of DOM state, which can then be restored if the user navigates back.

To do this, export a `snapshot` object with `capture` and `restore` methods from a `+page.svelte` or `+layout.svelte`:

```svelte
<!--- file: +page.svelte --->
<script>
  let comment = $state('');

  /** @type {import('./$types').Snapshot<string>} */
  export const snapshot = {
    capture: () => comment,
    restore: (value) => comment = value
  };
</script>

<form method="POST">
  <label for="comment">Comment</label>
  <textarea id="comment" bind:value={comment} />
  <button>Post comment</button>
</form>
```

When you navigate away from this page, the `capture` function is called immediately before the page updates, and the returned value is associated with the current entry in the browser's history stack. If you navigate back, the `restore` function is called with the stored value as soon as the page is updated.

The data must be serializable as JSON so that it can be persisted to `sessionStorage`. This allows the state to be restored when the page is reloaded, or when the user navigates back from a different site.

> [!NOTE] Avoid returning very large objects from `capture` — once captured, objects will be retained in memory for the duration of the session, and in extreme cases may be too large to persist to `sessionStorage`.

## Shallow routing

As you navigate around a SvelteKit app, you create _history entries_. Clicking the back and forward buttons traverses through this list of entries, re-running any `load` functions and replacing page components as necessary.

Sometimes, it's useful to create history entries _without_ navigating. For example, you might want to show a modal dialog that the user can dismiss by navigating back. This is particularly valuable on mobile devices, where swipe gestures are often more natural than interacting directly with the UI. In these cases, a modal that is _not_ associated with a history entry can be a source of frustration, as a user may swipe backwards in an attempt to dismiss it and find themselves on the wrong page.

SvelteKit makes this possible with the [`pushState`]($app-navigation#pushState) and [`replaceState`]($app-navigation#replaceState) functions, which allow you to associate state with a history entry without navigating. For example, to implement a history-driven modal:

```svelte
<!--- file: +page.svelte --->
<script>
  import { pushState } from '$app/navigation';
  import { page } from '$app/stores';
  import Modal from './Modal.svelte';

  function showModal() {
    pushState('', {
      showModal: true
    });
  }
</script>

{#if $page.state.showModal}
  <Modal close={() => history.back()} />
{/if}
```

The modal can be dismissed by navigating back (unsetting `$page.state.showModal`) or by interacting with it in a way that causes the `close` callback to run, which will navigate back programmatically.

## API

The first argument to `pushState` is the URL, relative to the current URL. To stay on the current URL, use `''`.

The second argument is the new page state, which can be accessed via the [page store]($app-stores#page) as `$page.state`. You can make page state type-safe by declaring an [`App.PageState`](types#PageState) interface (usually in `src/app.d.ts`).

To set page state without creating a new history entry, use `replaceState` instead of `pushState`.

## Loading data for a route

When shallow routing, you may want to render another `+page.svelte` inside the current page. For example, clicking on a photo thumbnail could pop up the detail view without navigating to the photo page.

For this to work, you need to load the data that the `+page.svelte` expects. A convenient way to do this is to use [`preloadData`]($app-navigation#preloadData) inside the `click` handler of an `<a>` element. If the element (or a parent) uses [`data-sveltekit-preload-data`](link-options#data-sveltekit-preload-data), the data will have already been requested, and `preloadData` will reuse that request.

```svelte
<!--- file: src/routes/photos/+page.svelte --->
<script>
  import { preloadData, pushState, goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Modal from './Modal.svelte';
  import PhotoPage from './[id]/+page.svelte';

  let { data } = $props();
</script>

{#each data.thumbnails as thumbnail}
  <a
    href="/photos/{thumbnail.id}"
    on:click={async (e) => {
      if (innerWidth < 640        // bail if the screen is too small
        || e.shiftKey             // or the link is opened in a new window
        || e.metaKey || e.ctrlKey // or a new tab (mac: metaKey, win/linux: ctrlKey)
        // should also consider clicking with a mouse scroll wheel
      ) return;

      // prevent navigation
      e.preventDefault();

      const { href } = e.currentTarget;

      // run `load` functions (or rather, get the result of the `load` functions
      // that are already running because of `data-sveltekit-preload-data`)
      const result = await preloadData(href);

      if (result.type === 'loaded' && result.status === 200) {
        pushState(href, { selected: result.data });
      } else {
        // something bad happened! try navigating
        goto(href);
      }
    }}
  >
    <img alt={thumbnail.alt} src={thumbnail.src} />
  </a>
{/each}

{#if $page.state.selected}
  <Modal on:close={() => history.back()}>
    <!-- pass page data to the +page.svelte component,
         just like SvelteKit would on navigation -->
    <PhotoPage data={$page.state.selected} />
  </Modal>
{/if}
```

### Caveats

During server-side rendering, `$page.state` is always an empty object. The same is true for the first page the user lands on — if the user reloads the page (or returns from another document), state will _not_ be applied until they navigate.

Shallow routing is a feature that requires JavaScript to work. Be mindful when using it and try to think of sensible fallback behavior in case JavaScript isn't available.


## Packaging

You can use SvelteKit to build apps as well as component libraries, using the `@sveltejs/package` package (`npx sv create` has an option to set this up for you).

When you're creating an app, the contents of `src/routes` is the public-facing stuff; [`src/lib`]($lib) contains your app's internal library.

A component library has the exact same structure as a SvelteKit app, except that `src/lib` is the public-facing bit, and your root `package.json` is used to publish the package. `src/routes` might be a documentation or demo site that accompanies the library, or it might just be a sandbox you use during development.

Running the `svelte-package` command from `@sveltejs/package` will take the contents of `src/lib` and generate a `dist` directory (which can be [configured](#Options)) containing the following:

- All the files in `src/lib`. Svelte components will be preprocessed, TypeScript files will be transpiled to JavaScript.
- Type definitions (`d.ts` files) which are generated for Svelte, JavaScript and TypeScript files. You need to install `typescript >= 4.0.0` for this. Type definitions are placed next to their implementation, hand-written `d.ts` files are copied over as is. You can [disable generation](#Options), but we strongly recommend against it — people using your library might use TypeScript, for which they require these type definition files.

> [!NOTE] `@sveltejs/package` version 1 generated a `package.json`. This is no longer the case and it will now use the `package.json` from your project and validate that it is correct instead. If you're still on version 1, see [this PR](https://github.com/sveltejs/kit/pull/8922) for migration instructions.

## Anatomy of a package.json

Since you're now building a library for public use, the contents of your `package.json` will become more important. Through it, you configure the entry points of your package, which files are published to npm, and which dependencies your library has. Let's go through the most important fields one by one.

### name

This is the name of your package. It will be available for others to install using that name, and visible on `https://npmjs.com/package/<name>`.

```json
{
  "name": "your-library"
}
```

Read more about it [here](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#name).

### license

Every package should have a license field so people know how they are allowed to use it. A very popular license which is also very permissive in terms of distribution and reuse without warranty is `MIT`.

```json
{
  "license": "MIT"
}
```

Read more about it [here](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#license). Note that you should also include a `LICENSE` file in your package.

### files

This tells npm which files it will pack up and upload to npm. It should contain your output folder (`dist` by default). Your `package.json` and `README` and `LICENSE` will always be included, so you don't need to specify them.

```json
{
  "files": ["dist"]
}
```

To exclude unnecessary files (such as unit tests, or modules that are only imported from `src/routes` etc) you can add them to an `.npmignore` file. This will result in smaller packages that are faster to install.

Read more about it [here](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#files).

### exports

The `"exports"` field contains the package's entry points. If you set up a new library project through `npx sv create`, it's set to a single export, the package root:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js"
    }
  }
}
```

This tells bundlers and tooling that your package only has one entry point, the root, and everything should be imported through that, like this:

```js
// @errors: 2307
import { Something } from 'your-library';
```

The `types` and `svelte` keys are [export conditions](https://nodejs.org/api/packages.html#conditional-exports). They tell tooling what file to import when they look up the `your-library` import:

- TypeScript sees the `types` condition and looks up the type definition file. If you don't publish type definitions, omit this condition.
- Svelte-aware tooling sees the `svelte` condition and knows this is a Svelte component library. If you publish a library that does not export any Svelte components and that could also work in non-Svelte projects (for example a Svelte store library), you can replace this condition with `default`.

> [!NOTE] Previous versions of `@sveltejs/package` also added a `package.json` export. This is no longer part of the template because all tooling can now deal with a `package.json` not being explicitly exported.

You can adjust `exports` to your liking and provide more entry points. For example, if instead of a `src/lib/index.js` file that re-exported components you wanted to expose a `src/lib/Foo.svelte` component directly, you could create the following export map...

```json
{
  "exports": {
    "./Foo.svelte": {
      "types": "./dist/Foo.svelte.d.ts",
      "svelte": "./dist/Foo.svelte"
    }
  }
}
```

...and a consumer of your library could import the component like so:

```js
// @filename: ambient.d.ts
declare module 'your-library/Foo.svelte';

// @filename: index.js
// ---cut---
import Foo from 'your-library/Foo.svelte';
```

> [!NOTE] Beware that doing this will need additional care if you provide type definitions. Read more about the caveat [here](#TypeScript)

In general, each key of the exports map is the path the user will have to use to import something from your package, and the value is the path to the file that will be imported or a map of export conditions which in turn contains these file paths.

Read more about `exports` [here](https://nodejs.org/docs/latest-v18.x/api/packages.html#package-entry-points).

### svelte

This is a legacy field that enabled tooling to recognise Svelte component libraries. It's no longer necessary when using the `svelte` [export condition](#Anatomy-of-a-package.json-exports), but for backwards compatibility with outdated tooling that doesn't yet know about export conditions it's good to keep it around. It should point towards your root entry point.

```json
{
  "svelte": "./dist/index.js"
}
```

### sideEffects

The `sideEffects` field in `package.json` is used by bundlers to determine if a module may contain code that has side effects. A module is considered to have side effects if it makes changes that are observable from other scripts outside the module when it's imported. For example, side effects include modifying global variables or the prototype of built-in JavaScript objects. Because a side effect could potentially affect the behavior of other parts of the application, these files/modules will be included in the final bundle regardless of whether their exports are used in the application. It is a best practice to avoid side effects in your code.

Setting the `sideEffects` field in `package.json` can help the bundler to be more aggressive in eliminating unused exports from the final bundle, a process known as tree-shaking. This results in smaller and more efficient bundles. Different bundlers handle `sideEffects` in various manners. While not necessary for Vite, we recommend that libraries state that all CSS files have side effects so that your library will be [compatible with webpack](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free). This is the configuration that comes with newly created projects:

```json
/// file: package.json
{
  "sideEffects": ["**/*.css"]
}
```

> If the scripts in your library have side effects, ensure that you update the `sideEffects` field. All scripts are marked as side effect free by default in newly created projects. If a file with side effects is incorrectly marked as having no side effects, it can result in broken functionality.

If your package has files with side effects, you can specify them in an array:

```json
/// file: package.json
{
    "sideEffects": [
      "**/*.css",
      "./dist/sideEffectfulFile.js"
    ]
}
```

This will treat only the specified files as having side effects.

## TypeScript

You should ship type definitions for your library even if you don't use TypeScript yourself so that people who do get proper intellisense when using your library. `@sveltejs/package` makes the process of generating types mostly opaque to you. By default, when packaging your library, type definitions are auto-generated for JavaScript, TypeScript and Svelte files. All you need to ensure is that the `types` condition in the [exports](#Anatomy-of-a-package.json-exports) map points to the correct files. When initialising a library project through `npx sv create`, this is automatically setup for the root export.

If you have something else than a root export however — for example providing a `your-library/foo` import — you need to take additional care for providing type definitions. Unfortunately, TypeScript by default will _not_ resolve the `types` condition for an export like `{ "./foo": { "types": "./dist/foo.d.ts", ... }}`. Instead, it will search for a `foo.d.ts` relative to the root of your library (i.e. `your-library/foo.d.ts` instead of `your-library/dist/foo.d.ts`). To fix this, you have two options:

The first option is to require people using your library to set the `moduleResolution` option in their `tsconfig.json` (or `jsconfig.json`) to `bundler` (available since TypeScript 5, the best and recommended option in the future), `node16` or `nodenext`. This opts TypeScript into actually looking at the exports map and resolving the types correctly.

The second option is to (ab)use the `typesVersions` feature from TypeScript to wire up the types. This is a field inside `package.json` TypeScript uses to check for different type definitions depending on the TypeScript version, and also contains a path mapping feature for that. We leverage that path mapping feature to get what we want. For the mentioned `foo` export above, the corresponding `typesVersions` looks like this:

```json
{
  "exports": {
    "./foo": {
      "types": "./dist/foo.d.ts",
      "svelte": "./dist/foo.js"
    }
  },
  "typesVersions": {
    ">4.0": {
      "foo": ["./dist/foo.d.ts"]
    }
  }
}
```

`>4.0` tells TypeScript to check the inner map if the used TypeScript version is greater than 4 (which should in practice always be true). The inner map tells TypeScript that the typings for `your-library/foo` are found within `./dist/foo.d.ts`, which essentially replicates the `exports` condition. You also have `*` as a wildcard at your disposal to make many type definitions at once available without repeating yourself. Note that if you opt into `typesVersions` you have to declare all type imports through it, including the root import (which is defined as `"index.d.ts": [..]`).

You can read more about that feature [here](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#version-selection-with-typesversions).

## Best practices

You should avoid using SvelteKit-specific modules like `$app/environment` in your packages unless you intend for them to only be consumable by other SvelteKit projects. E.g. rather than using `import { browser } from '$app/environment'` you could use `import { BROWSER } from 'esm-env'` ([see esm-env docs](https://github.com/benmccann/esm-env)). You may also wish to pass in things like the current URL or a navigation action as a prop rather than relying directly on `$app/stores`, `$app/navigation`, etc. Writing your app in this more generic fashion will also make it easier to setup tools for testing, UI demos and so on.

Ensure that you add [aliases](configuration#alias) via `svelte.config.js` (not `vite.config.js` or `tsconfig.json`), so that they are processed by `svelte-package`.

You should think carefully about whether or not the changes you make to your package are a bug fix, a new feature, or a breaking change, and update the package version accordingly. Note that if you remove any paths from `exports` or any `export` conditions inside them from your existing library, that should be regarded as a breaking change.

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
// changing `svelte` to `default` is a breaking change:
---			"svelte": "./dist/index.js"---
+++			"default": "./dist/index.js"+++
    },
// removing this is a breaking change:
---		"./foo": {
      "types": "./dist/foo.d.ts",
      "svelte": "./dist/foo.js",
      "default": "./dist/foo.js"
    },---
// adding this is ok:
+++		"./bar": {
      "types": "./dist/bar.d.ts",
      "svelte": "./dist/bar.js",
      "default": "./dist/bar.js"
    }+++
  }
}
```

## Options

`svelte-package` accepts the following options:

- `-w`/`--watch` — watch files in `src/lib` for changes and rebuild the package
- `-i`/`--input` — the input directory which contains all the files of the package. Defaults to `src/lib`
- `-o`/`--output` — the output directory where the processed files are written to. Your `package.json`'s `exports` should point to files inside there, and the `files` array should include that folder. Defaults to `dist`
- `-t`/`--types` — whether or not to create type definitions (`d.ts` files). We strongly recommend doing this as it fosters ecosystem library quality. Defaults to `true`
- `--tsconfig` - the path to a tsconfig or jsconfig. When not provided, searches for the next upper tsconfig/jsconfig in the workspace path.

## Publishing

To publish the generated package:

```sh
npm publish
```

## Caveats

All relative file imports need to be fully specified, adhering to Node's ESM algorithm. This means that for a file like `src/lib/something/index.js`, you must include the filename with the extension:

```js
// @errors: 2307
import { something } from './something+++/index.js+++';
```

If you are using TypeScript, you need to import `.ts` files the same way, but using a `.js` file ending, _not_ a `.ts` file ending. (This is a TypeScript design decision outside our control.) Setting `"moduleResolution": "NodeNext"` in your `tsconfig.json` or `jsconfig.json` will help you with this.

All files except Svelte files (preprocessed) and TypeScript files (transpiled to JavaScript) are copied across as-is.

# Styling

## Scoped styles


Svelte components can include a `<style>` element containing CSS that belongs to the component. This CSS is _scoped_ by default, meaning that styles will not apply to any elements on the page outside the component in question.

This works by adding a class to affected elements, which is based on a hash of the component styles (e.g. `svelte-123xyz`).

```svelte
<style>
	p {
		/* this will only affect <p> elements in this component */
		color: burlywood;
	}
</style>
```

## Specificity

Each scoped selector receives a [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) increase of 0-1-0, as a result of the scoping class (e.g. `.svelte-123xyz`) being added to the selector. This means that (for example) a `p` selector defined in a component will take precedence over a `p` selector defined in a global stylesheet, even if the global stylesheet is loaded later.

In some cases, the scoping class must be added to a selector multiple times, but after the first occurrence it is added with `:where(.svelte-xyz123)` in order to not increase specificity further.

## Scoped keyframes

If a component defines `@keyframes`, the name is scoped to the component using the same hashing approach. Any `animation` rules in the component will be similarly adjusted:

```svelte
<style>
	.bouncy {
		animation: bounce 10s;
	}

	/* these keyframes are only accessible inside this component */
	@keyframes bounce {
		/* ... *.
	}
</style>
```




## Global styles


## :global(...)

To apply styles to a single selector globally, use the `:global(...)` modifier:

```svelte
<style>
	:global(body) {
		/* applies to <body> */
		margin: 0;
	}

	div :global(strong) {
		/* applies to all <strong> elements, in any component,
		   that are inside <div> elements belonging
		   to this component */
		color: goldenrod;
	}

	p:global(.big.red) {
		/* applies to all <p> elements belonging to this component
		   with `class="big red"`, even if it is applied
		   programmatically (for example by a library) */
	}
</style>
```

If you want to make @keyframes that are accessible globally, you need to prepend your keyframe names with `-global-`.

The `-global-` part will be removed when compiled, and the keyframe will then be referenced using just `my-animation-name` elsewhere in your code.

```svelte
<style>
	@keyframes -global-my-animation-name {
		/* code goes here */
	}
</style>
```

## :global

To apply styles to a group of selectors globally, create a `:global {...}` block:

```svelte
<style>
	:global {
		/* applies to every <div> in your application */
		div { ... }

		/* applies to every <p> in your application */
		p { ... }
	}

	.a :global {
		/* applies to every `.b .c .d` element, in any component,
		   that is inside an `.a` element in this component */
		.b .c .d {...}
	}
</style>
```

> [!NOTE] The second example above could also be written as an equivalent `.a :global .b .c .d` selector, where everything after the `:global` is unscoped, though the nested form is preferred.

## Custom properties

You can pass CSS custom properties — both static and dynamic — to components:

```svelte
<Slider
	bind:value
	min={0}
	max={100}
	--track-color="black"
	--thumb-color="rgb({r} {g} {b})"
/>
```

The above code essentially desugars to this:

```svelte
<svelte-css-wrapper style="display: contents; --track-color: black; --thumb-color: rgb({r} {g} {b})">
	<Slider
		bind:value
		min={0}
		max={100}
	/>
</svelte-css-wrapper>
```

For an SVG element, it would use `<g>` instead:

```svelte
<g style="--track-color: black; --thumb-color: rgb({r} {g} {b})">
	<Slider
		bind:value
		min={0}
		max={100}
	/>
</g>
```

Inside the component, we can read these custom properties (and provide fallback values) using [`var(...)`](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties):

```svelte
<style>
	.track {
		background: var(--track-color, #aaa);
	}

	.thumb {
		background: var(--thumb-color, blue);
	}
</style>
```

You don't _have_ to specify the values directly on the component; as long as the custom properties are defined on a parent element, the component can use them. It's common to define custom properties on the `:root` element in a global stylesheet so that they apply to your entire application.

> [!NOTE] While the extra element will not affect layout, it _will_ affect any CSS selectors that (for example) use the `>` combinator to target an element directly inside the component's container.

## Nested `<style>` elements

There should only be 1 top-level `<style>` tag per component.

However, it is possible to have a `<style>` tag nested inside other elements or logic blocks.

In that case, the `<style>` tag will be inserted as-is into the DOM; no scoping or processing will be done on the `<style>` tag.

```svelte
<div>
	<style>
		/* this style tag will be inserted as-is */
		div {
			/* this will apply to all `<div>` elements in the DOM */
			color: red;
		}
	</style>
</div>
```
# Best practices

## Auth

Auth refers to authentication and authorization, which are common needs when building a web application. Authentication means verifying that the user is who they say they are based on their provided credentials. Authorization means determining which actions they are allowed to take.

## Sessions vs tokens

After the user has provided their credentials such as a username and password, we want to allow them to use the application without needing to provide their credentials again for future requests. Users are commonly authenticated on subsequent requests with either a session identifier or signed token such as a JSON Web Token (JWT).

Session IDs are most commonly stored in a database. They can be immediately revoked, but require a database query to be made on each request.

In contrast, JWT generally are not checked against a datastore, which means they cannot be immediately revoked. The advantage of this method is improved latency and reduced load on your datastore.

## Integration points

Auth [cookies](@sveltejs-kit#Cookies) can be checked inside [server hooks](hooks#Server-hooks). If a user is found matching the provided credentials, the user information can be stored in [`locals`](hooks#Server-hooks-handle).

## Guides

[Lucia](https://lucia-next.pages.dev/) is a reference for session-based web app auth. It contains example code snippets and projects for implementing session-based auth within SvelteKit and other JS projects. You can add code which follows the Lucia guide to your project with `npx sv create` when creating a new project or `npx sv add lucia` for an existing project.

An auth system is tightly coupled to a web framework because most of the code lies in validating user input, handling errors, and directing users to the appropriate next page. As a result, many of the generic JS auth libraries include one or more web frameworks within them. For this reason, many users will find it preferrable to follow a SvelteKit-specific guide such as the examples found in [Lucia](https://lucia-next.pages.dev/) rather than having multiple web frameworks inside their project.

## Performance

Out of the box, SvelteKit does a lot of work to make your applications as performant as possible:

- Code-splitting, so that only the code you need for the current page is loaded
- Asset preloading, so that 'waterfalls' (of files requesting other files) are prevented
- File hashing, so that your assets can be cached forever
- Request coalescing, so that data fetched from separate server `load` functions is grouped into a single HTTP request
- Parallel loading, so that separate universal `load` functions fetch data simultaneously
- Data inlining, so that requests made with `fetch` during server rendering can be replayed in the browser without issuing a new request
- Conservative invalidation, so that `load` functions are only re-run when necessary
- Prerendering (configurable on a per-route basis, if necessary) so that pages without dynamic data can be served instantaneously
- Link preloading, so that data and code requirements for a client-side navigation are eagerly anticipated

Nevertheless, we can't (yet) eliminate all sources of slowness. To eke out maximum performance, you should be mindful of the following tips.

## Diagnosing issues

Google's [PageSpeed Insights](https://pagespeed.web.dev/) and (for more advanced analysis) [WebPageTest](https://www.webpagetest.org/) are excellent ways to understand the performance characteristics of a site that is already deployed to the internet.

Your browser also includes useful developer tools for analysing your site, whether deployed or running locally:

* Chrome - [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview#devtools), [Network](https://developer.chrome.com/docs/devtools/network), and [Performance](https://developer.chrome.com/docs/devtools/performance) devtools
* Edge - [Lighthouse](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/lighthouse/lighthouse-tool), [Network](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/), and [Performance](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/evaluate-performance/) devtools
* Firefox - [Network](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/) and [Performance](https://hacks.mozilla.org/2022/03/performance-tool-in-firefox-devtools-reloaded/) devtools
* Safari - [enhancing the performance of your webpage](https://developer.apple.com/library/archive/documentation/NetworkingInternetWeb/Conceptual/Web_Inspector_Tutorial/EnhancingyourWebpagesPerformance/EnhancingyourWebpagesPerformance.html)

Note that your site running locally in `dev` mode will exhibit different behaviour than your production app, so you should do performance testing in [preview](building-your-app#Preview-your-app) mode after building.

### Instrumenting

If you see in the network tab of your browser that an API call is taking a long time and you'd like to understand why, you may consider instrumenting your backend with a tool like [OpenTelemetry](https://opentelemetry.io/) or [Server-Timing headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing).

## Optimizing assets

### Images

Reducing the size of image files is often one of the most impactful changes you can make to a site's performance. Svelte provides the `@sveltejs/enhanced-img` package, detailed on the [images](images) page, for making this easier. Additionally, Lighthouse is useful for identifying the worst offenders.

### Videos

Video files can be very large, so extra care should be taken to ensure that they're optimized:

- Compress videos with tools such as [Handbrake](https://handbrake.fr/). Consider converting the videos to web-friendly formats such as `.webm` or `.mp4`.
- You can [lazy-load videos](https://web.dev/articles/lazy-loading-video) located below the fold with `preload="none"` (though note that this will slow down playback when the user _does_ initiate it).
- Strip the audio track out of muted videos using a tool like [FFmpeg](https://ffmpeg.org/).

### Fonts

SvelteKit automatically preloads critical `.js` and `.css` files when the user visits a page, but it does _not_ preload fonts by default, since this may cause unnecessary files (such as font weights that are referenced by your CSS but not actually used on the current page) to be downloaded. Having said that, preloading fonts correctly can make a big difference to how fast your site feels. In your [`handle`](hooks#Server-hooks-handle) hook, you can call `resolve` with a `preload` filter that includes your fonts.

You can reduce the size of font files by [subsetting](https://web.dev/learn/performance/optimize-web-fonts#subset_your_web_fonts) your fonts.

## Reducing code size

### Svelte version

We recommend running the latest version of Svelte. Svelte 5 is smaller and faster than Svelte 4, which is smaller and faster than Svelte 3.

### Packages

[`rollup-plugin-visualizer`](https://www.npmjs.com/package/rollup-plugin-visualizer) can be helpful for identifying which packages are contributing the most to the size of your site. You may also find opportunities to remove code by manually inspecting the build output (use `build: { minify: false }` in your [Vite config](https://vitejs.dev/config/build-options.html#build-minify) to make the output readable, but remember to undo that before deploying your app), or via the network tab of your browser's devtools.

### External scripts

Try to minimize the number of third-party scripts running in the browser. For example, instead of using JavaScript-based analytics consider using server-side implementations, such as those offered by many platforms with SvelteKit adapters including [Cloudflare](https://www.cloudflare.com/web-analytics/), [Netlify](https://docs.netlify.com/monitor-sites/site-analytics/), and [Vercel](https://vercel.com/docs/analytics).

To run third party scripts in a web worker (which avoids blocking the main thread), use [Partytown's SvelteKit integration](https://partytown.builder.io/sveltekit).

### Selective loading

Code imported with static `import` declarations will be automatically bundled with the rest of your page. If there is a piece of code you need only when some condition is met, use the dynamic `import(...)` form to selectively lazy-load the component.

## Navigation

### Preloading

You can speed up client-side navigations by eagerly preloading the necessary code and data, using [link options](link-options). This is configured by default on the `<body>` element when you create a new SvelteKit app.

### Non-essential data

For slow-loading data that isn't needed immediately, the object returned from your `load` function can contain promises rather than the data itself. For server `load` functions, this will cause the data to [stream](load#Streaming-with-promises) in after the navigation (or initial page load).

### Preventing waterfalls

One of the biggest performance killers is what is referred to as a _waterfall_, which is a series of requests that is made sequentially. This can happen on the server or in the browser.

- Asset waterfalls can occur in the browser when your HTML requests JS which requests CSS which requests a background image and web font. SvelteKit will largely solve this class of problems for you by adding [`modulepreload`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/modulepreload) tags or headers, but you should view [the network tab in your devtools](#Diagnosing-issues) to check whether additional resources need to be preloaded. Pay special attention to this if you use web [fonts](#Optimizing-assets-Fonts) since they need to be handled manually.
- If a universal `load` function makes an API call to fetch the current user, then uses the details from that response to fetch a list of saved items, and then uses _that_ response to fetch the details for each item, the browser will end up making multiple sequential requests. This is deadly for performance, especially for users that are physically located far from your backend. Avoid this issue by using [server `load` functions](load#Universal-vs-server) where possible.
- Server `load` functions are also not immune to waterfalls (though they are much less costly since they rarely involve roundtrips with high latency). For example if you query a database to get the current user and then use that data to make a second query for a list of saved items, it will typically be more performant to issue a single query with a database join.

## Hosting

Your frontend should be located in the same data center as your backend to minimize latency. For sites with no central backend, many SvelteKit adapters support deploying to the _edge_, which means handling each user's requests from a nearby server. This can reduce load times significantly. Some adapters even support [configuring deployment on a per-route basis](page-options#config). You should also consider serving images from a CDN (which are typically edge networks) — the hosts for many SvelteKit adapters will do this automatically.

Ensure your host uses HTTP/2 or newer. Vite's code splitting creates numerous small files for improved cacheability, which results in excellent performance, but this does assume that your files can be loaded in parallel with HTTP/2.

## Further reading

For the most part, building a performant SvelteKit app is the same as building any performant web app. You should be able to apply information from general performance resources such as [Core Web Vitals](https://web.dev/explore/learn-core-web-vitals) to any web experience you build.

## Images

Images can have a big impact on your app's performance. For best results, you should optimize them by doing the following:

- generate optimal formats like `.avif` and `.webp`
- create different sizes for different screens
- ensure that assets can be cached effectively

Doing this manually is tedious. There are a variety of techniques you can use, depending on your needs and preferences.

## Vite's built-in handling

[Vite will automatically process imported assets](https://vitejs.dev/guide/assets.html) for improved performance. This includes assets referenced via the CSS `url()` function. Hashes will be added to the filenames so that they can be cached, and assets smaller than `assetsInlineLimit` will be inlined. Vite's asset handling is most often used for images, but is also useful for video, audio, etc.

```svelte
<script>
  import logo from '$lib/assets/logo.png';
</script>

<img alt="The project logo" src={logo} />
```

## @sveltejs/enhanced-img

`@sveltejs/enhanced-img` is a plugin offered on top of Vite's built-in asset handling. It provides plug and play image processing that serves smaller file formats like `avif` or `webp`, automatically sets the intrinsic `width` and `height` of the image to avoid layout shift, creates images of multiple sizes for various devices, and strips EXIF data for privacy. It will work in any Vite-based project including, but not limited to, SvelteKit projects.

> [!NOTE] As a build plugin, `@sveltejs/enhanced-img` can only optimize files located on your machine during the build process. If you have an image located elsewhere (such as a path served from your database, CMS, or backend), please read about [loading images dynamically from a CDN](#Loading-images-dynamically-from-a-CDN).
>
> **WARNING**: The `@sveltejs/enhanced-img` package is experimental. It uses pre-1.0 versioning and may introduce breaking changes with every minor version release.

### Setup

Install:

```bash
npm install --save-dev @sveltejs/enhanced-img
```

Adjust `vite.config.js`:

```js
import { sveltekit } from '@sveltejs/kit/vite';
+++import { enhancedImages } from '@sveltejs/enhanced-img';+++
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    +++enhancedImages(),+++
    sveltekit()
  ]
});
```

Building will take longer on the first build due to the computational expense of transforming images. However, the build output will be cached in `./node_modules/.cache/imagetools` so that subsequent builds will be fast.

### Basic usage

Use in your `.svelte` components by using `<enhanced:img>` rather than `<img>` and referencing the image file with a [Vite asset import](https://vitejs.dev/guide/assets.html#static-asset-handling) path:

```svelte
<enhanced:img src="./path/to/your/image.jpg" alt="An alt text" />
```

At build time, your `<enhanced:img>` tag will be replaced with an `<img>` wrapped by a `<picture>` providing multiple image types and sizes. It's only possible to downscale images without losing quality, which means that you should provide the highest resolution image that you need — smaller versions will be generated for the various device types that may request an image.

You should provide your image at 2x resolution for HiDPI displays (a.k.a. retina displays). `<enhanced:img>` will automatically take care of serving smaller versions to smaller devices.

If you wish to add styles to your `<enhanced:img>`, you should add a `class` and target that.

### Dynamically choosing an image

You can also manually import an image asset and pass it to an `<enhanced:img>`. This is useful when you have a collection of static images and would like to dynamically choose one or [iterate over them](https://github.com/sveltejs/kit/blob/0ab1733e394b6310895a1d3bf0f126ce34531170/sites/kit.svelte.dev/src/routes/home/Showcase.svelte). In this case you will need to update both the `import` statement and `<img>` element as shown below to indicate you'd like process them.

```svelte
<script>
  import MyImage from './path/to/your/image.jpg?enhanced';
</script>

<enhanced:img src={MyImage} alt="some alt text" />
```

You can also use [Vite's `import.meta.glob`](https://vitejs.dev/guide/features.html#glob-import). Note that you will have to specify `enhanced` via a [custom query](https://vitejs.dev/guide/features.html#custom-queries):

```svelte
<script>
  const imageModules = import.meta.glob(
    '/path/to/assets/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
    {
      eager: true,
      query: {
        enhanced: true
      }
    }
  )
</script>

{#each Object.entries(imageModules) as [_path, module]}
  <enhanced:img src={module.default} alt="some alt text" />
{/each}
```

### Intrinsic Dimensions

`width` and `height` are optional as they can be inferred from the source image and will be automatically added when the `<enhanced:img>` tag is preprocessed. With these attributes, the browser can reserve the correct amount of space, preventing [layout shift](https://web.dev/articles/cls). If you'd like to use a different `width` and `height` you can style the image with CSS. Because the preprocessor adds a `width` and `height` for you, if you'd like one of the dimensions to be automatically calculated then you will need to specify that:

```svelte
<style>
  .hero-image img {
    width: var(--size);
    height: auto;
  }
</style>
```

### `srcset` and `sizes`

If you have a large image, such as a hero image taking the width of the design, you should specify `sizes` so that smaller versions are requested on smaller devices. E.g. if you have a 1280px image you may want to specify something like:

```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)"/>
```

If `sizes` is specified, `<enhanced:img>` will generate small images for smaller devices and populate the `srcset` attribute.

The smallest picture generated automatically will have a width of 540px. If you'd like smaller images or would otherwise like to specify custom widths, you can do that with the `w` query parameter:
```svelte
<enhanced:img
  src="./image.png?w=1280;640;400"
  sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
/>
```

If `sizes` is not provided, then a HiDPI/Retina image and a standard resolution image will be generated. The image you provide should be 2x the resolution you wish to display so that the browser can display that image on devices with a high [device pixel ratio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio).

### Per-image transforms

By default, enhanced images will be transformed to more efficient formats. However, you may wish to apply other transforms such as a blur, quality, flatten, or rotate operation. You can run per-image transforms by appending a query string:

```svelte
<enhanced:img src="./path/to/your/image.jpg?blur=15" alt="An alt text" />
```

[See the imagetools repo for the full list of directives](https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md).

### Loading images dynamically from a CDN

In some cases, the images may not be accessible at build time — e.g. they may live inside a content management system or elsewhere.

Using a content delivery network (CDN) can allow you to optimize these images dynamically, and provides more flexibility with regards to sizes, but it may involve some setup overhead and usage costs. Depending on caching strategy, the browser may not be able to use a cached copy of the asset until a [304 response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) is received from the CDN. Building HTML to target CDNs allows using an `<img>` tag since the CDN can serve the appropriate format based on the `User-Agent` header, whereas build-time optimizations must produce `<picture>` tags with multiple sources. Finally, some CDNs may generate images lazily, which could have a negative performance impact for sites with low traffic and frequently changing images.

CDNs can generally be used without any need for a library. However, there are a number of libraries with Svelte support that make it easier. [`@unpic/svelte`](https://unpic.pics/img/svelte/) is a CDN-agnostic library with support for a large number of providers. You may also find that specific CDNs like [Cloudinary](https://svelte.cloudinary.dev/) have Svelte support. Finally, some content management systems (CMS) which support Svelte (such as [Contentful](https://www.contentful.com/sveltekit-starter-guide/), [Storyblok](https://github.com/storyblok/storyblok-svelte), and [Contentstack](https://www.contentstack.com/docs/developers/sample-apps/build-a-starter-website-with-sveltekit-and-contentstack)) have built-in support for image handling.

### Best practices

- For each image type, use the appropriate solution from those discussed above. You can mix and match all three solutions in one project. For example, you may use Vite's built-in handling to provide images for `<meta>` tags, display images on your homepage with `@sveltejs/enhanced-img`, and display user-submitted content with a dynamic approach.
- Consider serving all images via CDN regardless of the image optimization types you use. CDNs reduce latency by distributing copies of static assets globally.
- Your original images should have a good quality/resolution and should have 2x the width it will be displayed at to serve HiDPI devices. Image processing can size images down to save bandwidth when serving smaller screens, but it would be a waste of bandwidth to invent pixels to size images up.
- For images which are much larger than the width of a mobile device (roughly 400px), such as a hero image taking the width of the page design, specify `sizes` so that smaller images can be served on smaller devices.
- For important images, such as the [largest contentful paint (LCP)](https://web.dev/articles/lcp) image, set `fetchpriority="high" loading="eager"` to prioritize loading as early as possible.
- Give the image a container or styling so that it is constrained and does not jump around while the page is loading affecting your [cumulative layout shift (CLS)](https://web.dev/articles/cls). `width` and `height` help the browser to reserve space while the image is still loading, so `@sveltejs/enhanced-img` will add a `width` and `height` for you.
- Always provide a good `alt` text. The Svelte compiler will warn you if you don't do this.
- Do not use `em` or `rem` in `sizes` and change the default size of these measures. When used in `sizes` or `@media` queries, `em` and `rem` are both defined to mean the user's default `font-size`. For a `sizes` declaration like `sizes="(min-width: 768px) min(100vw, 108rem), 64rem"`, the actual `em` or `rem` that controls how the image is laid out on the page can be different if changed by CSS. For example, do not do something like `html { font-size: 62.5%; }` as the slot reserved by the browser preloader will now end up being larger than the actual slot of the CSS object model once it has been created.


## Accessibility

SvelteKit strives to provide an accessible platform for your app by default. Svelte's [compile-time accessibility checks](../svelte/compiler-warnings) will also apply to any SvelteKit application you build.

Here's how SvelteKit's built-in accessibility features work and what you need to do to help these features to work as well as possible. Keep in mind that while SvelteKit provides an accessible foundation, you are still responsible for making sure your application code is accessible. If you're new to accessibility, see the ["further reading"](accessibility#Further-reading) section of this guide for additional resources.

We recognize that accessibility can be hard to get right. If you want to suggest improvements to how SvelteKit handles accessibility, please [open a GitHub issue](https://github.com/sveltejs/kit/issues).

## Route announcements

In traditional server-rendered applications, every navigation (e.g. clicking on an `<a>` tag) triggers a full page reload. When this happens, screen readers and other assistive technology will read out the new page's title so that users understand that the page has changed.

Since navigation between pages in SvelteKit happens without reloading the page (known as [client-side routing](glossary#Routing)), SvelteKit injects a [live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) onto the page that will read out the new page name after each navigation. This determines the page name to announce by inspecting the `<title>` element.

Because of this behavior, every page in your app should have a unique, descriptive title. In SvelteKit, you can do this by placing a `<svelte:head>` element on each page:

```svelte
<!--- file: src/routes/+page.svelte --->
<svelte:head>
  <title>Todo List</title>
</svelte:head>
```

This will allow screen readers and other assistive technology to identify the new page after a navigation occurs. Providing a descriptive title is also important for [SEO](seo#Manual-setup-title-and-meta).

## Focus management

In traditional server-rendered applications, every navigation will reset focus to the top of the page. This ensures that people browsing the web with a keyboard or screen reader will start interacting with the page from the beginning.

To simulate this behavior during client-side routing, SvelteKit focuses the `<body>` element after each navigation and [enhanced form submission](form-actions#Progressive-enhancement). There is one exception - if an element with the [`autofocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus) attribute is present, SvelteKit will focus that element instead. Make sure to [consider the implications for assistive technology](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus#accessibility_considerations) when using that attribute.

If you want to customize SvelteKit's focus management, you can use the `afterNavigate` hook:

```js
/// <reference types="@sveltejs/kit" />
// ---cut---
import { afterNavigate } from '$app/navigation';

afterNavigate(() => {
  /** @type {HTMLElement | null} */
  const to_focus = document.querySelector('.focus-me');
  to_focus?.focus();
});
```

You can also programmatically navigate to a different page using the [`goto`]($app-navigation#goto) function. By default, this will have the same client-side routing behavior as clicking on a link. However, `goto` also accepts a `keepFocus` option that will preserve the currently-focused element instead of resetting focus. If you enable this option, make sure the currently-focused element still exists on the page after navigation. If the element no longer exists, the user's focus will be lost, making for a confusing experience for assistive technology users.

## The "lang" attribute

By default, SvelteKit's page template sets the default language of the document to English. If your content is not in English, you should update the `<html>` element in `src/app.html` to have the correct [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang#accessibility) attribute. This will ensure that any assistive technology reading the document uses the correct pronunciation. For example, if your content is in German, you should update `app.html` to the following:

```html
/// file: src/app.html
<html lang="de">
```

If your content is available in multiple languages, you should set the `lang` attribute based on the language of the current page. You can do this with SvelteKit's [handle hook](hooks#Server-hooks-handle):

```html
/// file: src/app.html
<html lang="%lang%">
```

```js
/// file: src/hooks.server.js
/**
 * @param {import('@sveltejs/kit').RequestEvent} event
 */
function get_lang(event) {
  return 'en';
}
// ---cut---
/** @type {import('@sveltejs/kit').Handle} */
export function handle({ event, resolve }) {
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', get_lang(event))
  });
}
```

## Further reading

For the most part, building an accessible SvelteKit app is the same as building an accessible web app. You should be able to apply information from the following general accessibility resources to any web experience you build:

- [MDN Web Docs: Accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)
- [The A11y Project](https://www.a11yproject.com/)
- [How to Meet WCAG (Quick Reference)](https://www.w3.org/WAI/WCAG21/quickref/)


## SEO

The most important aspect of SEO is to create high-quality content that is widely linked to from around the web. However, there are a few technical considerations for building sites that rank well.

## Out of the box

### SSR

While search engines have got better in recent years at indexing content that was rendered with client-side JavaScript, server-side rendered content is indexed more frequently and reliably. SvelteKit employs SSR by default, and while you can disable it in [`handle`](hooks#Server-hooks-handle), you should leave it on unless you have a good reason not to.

> [!NOTE] SvelteKit's rendering is highly configurable and you can implement [dynamic rendering](https://developers.google.com/search/docs/advanced/javascript/dynamic-rendering) if necessary. It's not generally recommended, since SSR has other benefits beyond SEO.

### Performance

Signals such as [Core Web Vitals](https://web.dev/vitals/#core-web-vitals) impact search engine ranking. Because Svelte and SvelteKit introduce minimal overhead, it's easier to build high performance sites. You can test your site's performance using Google's [PageSpeed Insights](https://pagespeed.web.dev/) or [Lighthouse](https://developers.google.com/web/tools/lighthouse). Read [the performance page](performance) for more details.

### Normalized URLs

SvelteKit redirects pathnames with trailing slashes to ones without (or vice versa depending on your [configuration](page-options#trailingSlash)), as duplicate URLs are bad for SEO.

## Manual setup

### &lt;title&gt; and &lt;meta&gt;

Every page should have well-written and unique `<title>` and `<meta name="description">` elements inside a [`<svelte:head>`](../svelte/svelte-head). Guidance on how to write descriptive titles and descriptions, along with other suggestions on making content understandable by search engines, can be found on Google's [Lighthouse SEO audits](https://web.dev/lighthouse-seo/) documentation.

> [!NOTE] A common pattern is to return SEO-related `data` from page [`load`](load) functions, then use it (as [`$page.data`]($app-stores)) in a `<svelte:head>` in your root [layout](routing#layout).

### Sitemaps

[Sitemaps](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap) help search engines prioritize pages within your site, particularly when you have a large amount of content. You can create a sitemap dynamically using an endpoint:

```js
/// file: src/routes/sitemap.xml/+server.js
export async function GET() {
  return new Response(
    `
    <?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="https://www.w3.org/1999/xhtml"
      xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
      xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
      <!-- <url> elements go here -->
    </urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
}
```

### AMP

An unfortunate reality of modern web development is that it is sometimes necessary to create an [Accelerated Mobile Pages (AMP)](https://amp.dev/) version of your site. In SvelteKit this can be done by setting the [`inlineStyleThreshold`](configuration#inlineStyleThreshold) option...

```js
/// file: svelte.config.js
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // since <link rel="stylesheet"> isn't
    // allowed, inline all styles
    inlineStyleThreshold: Infinity
  }
};

export default config;
```

...disabling `csr` in your root `+layout.js`/`+layout.server.js`...

```js
/// file: src/routes/+layout.server.js
export const csr = false;
```

...adding `amp` to your `app.html`

```html
<html amp>
...
```

...and transforming the HTML using `transformPageChunk` along with `transform` imported from `@sveltejs/amp`:

```js
/// file: src/hooks.server.js
import * as amp from '@sveltejs/amp';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  let buffer = '';
  return await resolve(event, {
    transformPageChunk: ({ html, done }) => {
      buffer += html;
      if (done) return amp.transform(buffer);
    }
  });
}
```

To prevent shipping any unused CSS as a result of transforming the page to amp, we can use [`dropcss`](https://www.npmjs.com/package/dropcss):

```js
// @filename: ambient.d.ts
declare module 'dropcss';

// @filename: index.js
// ---cut---
/// file: src/hooks.server.js
// @errors: 2307
import * as amp from '@sveltejs/amp';
import dropcss from 'dropcss';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  let buffer = '';

  return await resolve(event, {
    transformPageChunk: ({ html, done }) => {
      buffer += html;

      if (done) {
        let css = '';
        const markup = amp
          .transform(buffer)
          .replace('⚡', 'amp') // dropcss can't handle this character
          .replace(/<style amp-custom([^>]*?)>([^]+?)<\/style>/, (match, attributes, contents) => {
            css = contents;
            return `<style amp-custom${attributes}></style>`;
          });

        css = dropcss({ css, html: markup }).css;
        return markup.replace('</style>', `${css}</style>`);
      }
    }
  });
}

```

> [!NOTE] It's a good idea to use the `handle` hook to validate the transformed HTML using `amphtml-validator`, but only if you're prerendering pages since it's very slow.
> # Special Elements


## `<svelte:window>`


```svelte
<svelte:window onevent={handler} />
```

```svelte
<svelte:window bind:prop={value} />
```

The `<svelte:window>` element allows you to add event listeners to the `window` object without worrying about removing them when the component is destroyed, or checking for the existence of `window` when server-side rendering.

This element may only appear at the top level of your component — it cannot be inside a block or element.

```svelte
<script>
	function handleKeydown(event) {
		alert(`pressed the ${event.key} key`);
	}
</script>

<svelte:window onkeydown={handleKeydown} />
```

You can also bind to the following properties:

- `innerWidth`
- `innerHeight`
- `outerWidth`
- `outerHeight`
- `scrollX`
- `scrollY`
- `online` — an alias for `window.navigator.onLine`
- `devicePixelRatio`

All except `scrollX` and `scrollY` are readonly.

```svelte
<svelte:window bind:scrollY={y} />
```

> [!NOTE] Note that the page will not be scrolled to the initial value to avoid accessibility issues. Only subsequent changes to the bound variable of `scrollX` and `scrollY` will cause scrolling. If you have a legitimate reason to scroll when the component is rendered, call `scrollTo()` in an `$effect`.

## `<svelte:document>`


```svelte
<svelte:document onevent={handler} />
```

```svelte
<svelte:document bind:prop={value} />
```

Similarly to `<svelte:window>`, this element allows you to add listeners to events on `document`, such as `visibilitychange`, which don't fire on `window`. It also lets you use [actions](use) on `document`.

As with `<svelte:window>`, this element may only appear the top level of your component and must never be inside a block or element.

```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

You can also bind to the following properties:

- `activeElement`
- `fullscreenElement`
- `pointerLockElement`
- `visibilityState`

All are readonly.

## `<svelte:body>`

```svelte
<svelte:body onevent={handler} />
```

Similarly to `<svelte:window>`, this element allows you to add listeners to events on `document.body`, such as `mouseenter` and `mouseleave`, which don't fire on `window`. It also lets you use [actions](use) on the `<body>` element.

As with `<svelte:window>` and `<svelte:document>`, this element may only appear the top level of your component and must never be inside a block or element.

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```

## `<svelte:head>`

```svelte
<svelte:head>...</svelte:head>
```

This element makes it possible to insert elements into `document.head`. During server-side rendering, `head` content is exposed separately to the main `body` content.

As with `<svelte:window>`, `<svelte:document>` and `<svelte:body>`, this element may only appear at the top level of your component and must never be inside a block or element.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
```

## `<svelte:element>`

```svelte
<svelte:element this={expression} />
```

The `<svelte:element>` element lets you render an element that is unknown at author time, for example because it comes from a CMS. Any properties and event listeners present will be applied to the element.

The only supported binding is `bind:this`, since Svelte's built-in bindings do not work with generic elements.

If `this` has a nullish value, the element and its children will not be rendered.

If `this` is the name of a [void element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element) (e.g., `br`) and `<svelte:element>` has child elements, a runtime error will be thrown in development mode:

```svelte
<script>
	let tag = $state('hr');
</script>

<svelte:element this={tag}>
	This text cannot appear inside an hr element
</svelte:element>
```

Svelte tries its best to infer the correct namespace from the element's surroundings, but it's not always possible. You can make it explicit with an `xmlns` attribute:

```svelte
<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />

```

## `<svelte:options>`


```svelte
<svelte:options option={value} />
```

The `<svelte:options>` element provides a place to specify per-component compiler options, which are detailed in the [compiler section](svelte-compiler#compile). The possible options are:

- `immutable={true}` — you never use mutable data, so the compiler can do simple referential equality checks to determine if values have changed
- `immutable={false}` — the default. Svelte will be more conservative about whether or not mutable objects have changed
- `accessors={true}` — adds getters and setters for the component's props
- `accessors={false}` — the default
- `runes={true}` — forces a component into _runes mode_ (see the [Legacy APIs](legacy-overview) section)
- `runes={false}` — forces a component into _legacy mode_
- `namespace="..."` — the namespace where this component will be used, most commonly "svg"; use the "foreign" namespace to opt out of case-insensitive attribute names and HTML-specific warnings
- `customElement={...}` — the [options](custom-elements#Component-options) to use when compiling this component as a custom element. If a string is passed, it is used as the `tag` option

```svelte
<svelte:options customElement="my-custom-element" />
```
# Runtime

## Stores

A _store_ is an object that allows reactive access to a value via a simple _store contract_. The [`svelte/store` module](../svelte-store) contains minimal store implementations which fulfil this contract.

Any time you have a reference to a store, you can access its value inside a component by prefixing it with the `$` character. This causes Svelte to declare the prefixed variable, subscribe to the store at component initialisation and unsubscribe when appropriate.

Assignments to `$`-prefixed variables require that the variable be a writable store, and will result in a call to the store's `.set` method.

Note that the store must be declared at the top level of the component — not inside an `if` block or a function, for example.

Local variables (that do not represent store values) must _not_ have a `$` prefix.

```svelte
<script>
  import { writable } from 'svelte/store';

  const count = writable(0);
  console.log($count); // logs 0

  count.set(1);
  console.log($count); // logs 1

  $count = 2;
  console.log($count); // logs 2
</script>
```

## When to use stores

Prior to Svelte 5, stores were the go-to solution for creating cross-component reactive states or extracting logic. With runes, these use cases have greatly diminished.

- when extracting logic, it's better to take advantage of runes' universal reactivity: You can use runes outside the top level of components and even place them into JavaScript or TypeScript files (using a `.svelte.js` or `.svelte.ts` file ending)
- when creating shared state, you can create a `$state` object containing the values you need and manipulating said state

Stores are still a good solution when you have complex asynchronous data streams or it's important to have more manual control over updating values or listening to changes. If you're familiar with RxJs and want to reuse that knowledge, the `$` also comes in handy for you.

## svelte/store

The `svelte/store` module contains a minimal store implementation which fulfil the store contract. It provides methods for creating stores that you can update from the outside, stores you can only update from the inside, and for combining and deriving stores.

### `writable`

Function that creates a store which has values that can be set from 'outside' components. It gets created as an object with additional `set` and `update` methods.

`set` is a method that takes one argument which is the value to be set. The store value gets set to the value of the argument if the store value is not already equal to it.

`update` is a method that takes one argument which is a callback. The callback takes the existing store value as its argument and returns the new value to be set to the store.

```js
/// file: store.js
import { writable } from 'svelte/store';

const count = writable(0);

count.subscribe((value) => {
  console.log(value);
}); // logs '0'

count.set(1); // logs '1'

count.update((n) => n + 1); // logs '2'
```

If a function is passed as the second argument, it will be called when the number of subscribers goes from zero to one (but not from one to two, etc). That function will be passed a `set` function which changes the value of the store, and an `update` function which works like the `update` method on the store, taking a callback to calculate the store's new value from its old value. It must return a `stop` function that is called when the subscriber count goes from one to zero.

```js
/// file: store.js
import { writable } from 'svelte/store';

const count = writable(0, () => {
  console.log('got a subscriber');
  return () => console.log('no more subscribers');
});

count.set(1); // does nothing

const unsubscribe = count.subscribe((value) => {
  console.log(value);
}); // logs 'got a subscriber', then '1'

unsubscribe(); // logs 'no more subscribers'
```

Note that the value of a `writable` is lost when it is destroyed, for example when the page is refreshed. However, you can write your own logic to sync the value to for example the `localStorage`.

### `readable`

Creates a store whose value cannot be set from 'outside', the first argument is the store's initial value, and the second argument to `readable` is the same as the second argument to `writable`.

```ts
import { readable } from 'svelte/store';

const time = readable(new Date(), (set) => {
  set(new Date());

  const interval = setInterval(() => {
    set(new Date());
  }, 1000);

  return () => clearInterval(interval);
});

const ticktock = readable('tick', (set, update) => {
  const interval = setInterval(() => {
    update((sound) => (sound === 'tick' ? 'tock' : 'tick'));
  }, 1000);

  return () => clearInterval(interval);
});
```

### `derived`

Derives a store from one or more other stores. The callback runs initially when the first subscriber subscribes and then whenever the store dependencies change.

In the simplest version, `derived` takes a single store, and the callback returns a derived value.

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
  const a: Writable<number>;
}

export {};

// @filename: index.ts
// ---cut---
import { derived } from 'svelte/store';

const doubled = derived(a, ($a) => $a * 2);
```

The callback can set a value asynchronously by accepting a second argument, `set`, and an optional third argument, `update`, calling either or both of them when appropriate.

In this case, you can also pass a third argument to `derived` — the initial value of the derived store before `set` or `update` is first called. If no initial value is specified, the store's initial value will be `undefined`.

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
  const a: Writable<number>;
}

export {};

// @filename: index.ts
// @errors: 18046 2769 7006
// ---cut---
import { derived } from 'svelte/store';

const delayed = derived(
  a,
  ($a, set) => {
    setTimeout(() => set($a), 1000);
  },
  2000
);

const delayedIncrement = derived(a, ($a, set, update) => {
  set($a);
  setTimeout(() => update((x) => x + 1), 1000);
  // every time $a produces a value, this produces two
  // values, $a immediately and then $a + 1 a second later
});
```

If you return a function from the callback, it will be called when a) the callback runs again, or b) the last subscriber unsubscribes.

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
  const frequency: Writable<number>;
}

export {};

// @filename: index.ts
// ---cut---
import { derived } from 'svelte/store';

const tick = derived(
  frequency,
  ($frequency, set) => {
    const interval = setInterval(() => {
      set(Date.now());
    }, 1000 / $frequency);

    return () => {
      clearInterval(interval);
    };
  },
  2000
);
```

In both cases, an array of arguments can be passed as the first argument instead of a single store.

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
  const a: Writable<number>;
  const b: Writable<number>;
}

export {};

// @filename: index.ts

// ---cut---
import { derived } from 'svelte/store';

const summed = derived([a, b], ([$a, $b]) => $a + $b);

const delayed = derived([a, b], ([$a, $b], set) => {
  setTimeout(() => set($a + $b), 1000);
});
```

### `readonly`

This simple helper function makes a store readonly. You can still subscribe to the changes from the original one using this new readable store.

```js
import { readonly, writable } from 'svelte/store';

const writableStore = writable(1);
const readableStore = readonly(writableStore);

readableStore.subscribe(console.log);

writableStore.set(2); // console: 2
// @errors: 2339
readableStore.set(2); // ERROR
```

### `get`

Generally, you should read the value of a store by subscribing to it and using the value as it changes over time. Occasionally, you may need to retrieve the value of a store to which you're not subscribed. `get` allows you to do so.

> [!NOTE] This works by creating a subscription, reading the value, then unsubscribing. It's therefore not recommended in hot code paths.

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
  const store: Writable<string>;
}

export {};

// @filename: index.ts
// ---cut---
import { get } from 'svelte/store';

const value = get(store);
```

## Store contract

```ts
// @noErrors
store = { subscribe: (subscription: (value: any) => void) => (() => void), set?: (value: any) => void }
```

You can create your own stores without relying on [`svelte/store`](../svelte-store), by implementing the _store contract_:

1. A store must contain a `.subscribe` method, which must accept as its argument a subscription function. This subscription function must be immediately and synchronously called with the store's current value upon calling `.subscribe`. All of a store's active subscription functions must later be synchronously called whenever the store's value changes.
2. The `.subscribe` method must return an unsubscribe function. Calling an unsubscribe function must stop its subscription, and its corresponding subscription function must not be called again by the store.
3. A store may _optionally_ contain a `.set` method, which must accept as its argument a new value for the store, and which synchronously calls all of the store's active subscription functions. Such a store is called a _writable store_.

For interoperability with RxJS Observables, the `.subscribe` method is also allowed to return an object with an `.unsubscribe` method, rather than return the unsubscription function directly. Note however that unless `.subscribe` synchronously calls the subscription (which is not required by the Observable spec), Svelte will see the value of the store as `undefined` until it does.


## Context

<!-- - get/set/hasContext
- how to use, best practises (like encapsulating them) -->

Most state is component-level state that lives as long as its component lives. There's also section-wide or app-wide state however, which also needs to be handled somehow.

The easiest way to do that is to create global state and just import that.

```ts
/// file: state.svelte.js
export const myGlobalState = $state({
  user: {
    /* ... */
  }
  /* ... */
});
```

```svelte
<!--- file: App.svelte --->
<script>
  import { myGlobalState } from './state.svelte';
  // ...
</script>
```

This has a few drawbacks though:

- it only safely works when your global state is only used client-side - for example, when you're building a single page application that does not render any of your components on the server. If your state ends up being managed and updated on the server, it could end up being shared between sessions and/or users, causing bugs
- it may give the false impression that certain state is global when in reality it should only used in a certain part of your app

To solve these drawbacks, Svelte provides a few `context` primitives which alleviate these problems.

## Setting and getting context

To associate an arbitrary object with the current component, use `setContext`.

```svelte
<script>
  import { setContext } from 'svelte';

  setContext('key', value);
</script>
```

The context is then available to children of the component (including slotted content) with `getContext`.

```svelte
<script>
  import { getContext } from 'svelte';

  const value = getContext('key');
</script>
```

`setContext` and `getContext` solve the above problems:

- the state is not global, it's scoped to the component. That way it's safe to render your components on the server and not leak state
- it's clear that the state is not global but rather scoped to a specific component tree and therefore can't be used in other parts of your app

> [!NOTE] `setContext`/`getContext` must be called during component initialisation.

Context is not inherently reactive. If you need reactive values in context then you can pass a `$state` object into context, whose properties _will_ be reactive.

```svelte
<!--- file: Parent.svelte --->
<script>
  import { setContext } from 'svelte';

  let value = $state({ count: 0 });
  setContext('counter', value);
</script>

<button onclick={() => value.count++}>increment</button>
```

```svelte
<!--- file: Child.svelte --->
<script>
  import { getContext } from 'svelte';

  const value = getContext('counter');
</script>

<p>Count is {value.count}</p>
```

To check whether a given `key` has been set in the context of a parent component, use `hasContext`.

```svelte
<script>
  import { hasContext } from 'svelte';

  if (hasContext('key')) {
    // do something
  }
</script>
```

You can also retrieve the whole context map that belongs to the closest parent component using `getAllContexts`. This is useful, for example, if you programmatically create a component and want to pass the existing context to it.

```svelte
<script>
  import { getAllContexts } from 'svelte';

  const contexts = getAllContexts();
</script>
```

## Encapsulating context interactions

The above methods are very unopinionated about how to use them. When your app grows in scale, it's worthwhile to encapsulate setting and getting the context into functions and properly type them.

```ts
// @errors: 2304
import { getContext, setContext } from 'svelte';

let userKey = Symbol('user');

export function setUserContext(user: User) {
  setContext(userKey, user);
}

export function getUserContext(): User {
  return getContext(userKey) as User;
}
```

## Lifecycle hooks

<!-- - onMount/onDestroy
- mention that `$effect` might be better for your use case
- beforeUpdate/afterUpdate with deprecation notice?
- or skip this entirely and only have it in the reference docs? -->

In Svelte 5, the component lifecycle consists of only two parts: Its creation and its destruction. Everything in-between - when certain state is updated - is not related to the component as a whole, only the parts that need to react to the state change are notified. This is because under the hood the smallest unit of change is actually not a component, it's the (render) effects that the component sets up upon component initialization. Consequently, there's no such thing as a "before update"/"after update" hook.

## `onMount`

The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM. It must be called during the component's initialisation (but doesn't need to live _inside_ the component; it can be called from an external module).

`onMount` does not run inside a component that is rendered on the server.

```svelte
<script>
  import { onMount } from 'svelte';

  onMount(() => {
    console.log('the component has mounted');
  });
</script>
```

If a function is returned from `onMount`, it will be called when the component is unmounted.

```svelte
<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const interval = setInterval(() => {
      console.log('beep');
    }, 1000);

    return () => clearInterval(interval);
  });
</script>
```

> [!NOTE] This behaviour will only work when the function passed to `onMount` _synchronously_ returns a value. `async` functions always return a `Promise`, and as such cannot _synchronously_ return a function.

## `onDestroy`

> EXPORT_SNIPPET: svelte#onDestroy

Schedules a callback to run immediately before the component is unmounted.

Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the only one that runs inside a server-side component.

```svelte
<script>
  import { onDestroy } from 'svelte';

  onDestroy(() => {
    console.log('the component is being destroyed');
  });
</script>
```

## `tick`

While there's no "after update" hook, you can use `tick` to ensure that the UI is updated before continuing. `tick` returns a promise that resolves once any pending state changes have been applied, or in the next microtask if there are none.

```svelte
<script>
  import { beforeUpdate, tick } from 'svelte';

  beforeUpdate(async () => {
    console.log('the component is about to update');
    await tick();
    console.log('the component just updated');
  });
</script>
```

## Deprecated: `beforeUpdate` / `afterUpdate`

Svelte 4 contained hooks that ran before and after the component as a whole was updated. For backwards compatibility, these hooks were shimmed in Svelte 5 but not available inside components that use runes.

```svelte
<script>
  import { beforeUpdate, afterUpdate } from 'svelte';

  beforeUpdate(() => {
    console.log('the component is about to update');
  });

  afterUpdate(() => {
    console.log('the component just updated');
  });
</script>
```

Instead of `beforeUpdate` use `$effect.pre` and instead of `afterUpdate` use `$effect` instead - these runes offer more granular control and only react to the changes you're actually interested in.

### Chat window example

To implement a chat window that autoscrolls to the bottom when new messages appear (but only if you were _already_ scrolled to the bottom), we need to measure the DOM before we update it.

In Svelte 4, we do this with `beforeUpdate`, but this is a flawed approach — it fires before _every_ update, whether it's relevant or not. In the example below, we need to introduce checks like `updatingMessages` to make sure we don't mess with the scroll position when someone toggles dark mode.

With runes, we can use `$effect.pre`, which behaves the same as `$effect` but runs before the DOM is updated. As long as we explicitly reference `messages` inside the effect body, it will run whenever `messages` changes, but _not_ when `theme` changes.

`beforeUpdate`, and its equally troublesome counterpart `afterUpdate`, are therefore deprecated in Svelte 5.

- [Before](/playground/untitled#H4sIAAAAAAAAE31WXa_bNgz9K6yL1QmWOLlrC-w6H8MeBgwY9tY9NfdBtmlbiywZkpyPBfnvo2zLcZK28AWuRPGI5OGhkEuQc4EmiL9eAskqDOLg97oOZoE9125jDigs0t6oRqfOsjap5rXd7uTO8qpW2sIFEsyVxn_qjFmcAcstar-xPN3DFXKtKgi768IVgQku0ELj3Lgs_kZjWIEGNpAzYXDlHWyJFZI1zJjeh4O5uvl_DY8oUkVeVoFuJKYls-_CGYS25Aboj0EtWNqel0wWoBoLTGZgmdgDS9zW4Uz4NsrswPHoyutN4xInkylstnBxdmIhh8m7xzqmoNE2Wq46n1RJQzEbq4g-JQSl7e-HDx-GdaTy3KD9E3lRWvj5Zu9QX1QN20dj7zyHz8s-1S6lW7Cpz3RnXTcm04hIlfdFuO8p2mQ5-3a06cqjrn559bF_2NHOnRZ5I1PLlXQNyQT-hedMHeUEDyjtdMxsa4n2eIbNhlTwhyRthaOKOmYtniwF6pwt0wXa6MBEg0OibZec27gz_dk3UrZ6hB2LLYoiv521Yd8Gt-foTrfhiCDP0lC9VUUhcDLU49Xe_9943cNvEArHfAjxeBTovvXiNpFynfEDpIIZs9kFbg52QbeNHWZzebz32s7xHco3nJAJl1nshmhz8dYOQJDyZetnbb2gTWe-vEeWlrfpZMavr56ldb29eNt6UXvgwgFbp_WC0tl2RK25rGk6lYz3nUI2lzvBXGHhPZPGWmKUXFNBKqdaW259wl_aHbiqoVIZdpE60Nax6IOujT0LbFFxIVTCxCRR2XloUcYNvSbnGHKBp763jHoj59xiZWJI0Wm0P_m3MSS985xkasn-cFq20xTDy3J5KFcjgUTD69BHdcHIjz431z28IqlxGcPSfdFnrGDZn6gD6lyo45zyHAD-btczf-98nhQxHEvKfeUtOVkSejD3q-9X7JbzjGtsdUxlKdFU8qGsT78uaw848syWMXz85Waq2Gnem4mAn3prweq4q6Y3JEpnqMmnPoFRgmd3ySW0LLRqSKlwYHriCvJvUs2yjMaaoA-XzTXLeGMe45zmhv_XAno3Mj0xF7USuqNvnE9H343QHlq-eAgxpbTPNR9yzUkgLjwSR0NK4wKoxy-jDg-9vy8sUSToakzW-9fX13Em9Q8T6Z26uZhBN36XUYo5q7ggLXBZoub2Ofv7g6GCZfTxe034NCjiudXj7Omla0eTfo7QBPOcYxbE7qG-vl3_B1G-_i_JCAAA)
- [After](/playground/untitled#H4sIAAAAAAAAE31WXa-jNhD9K7PsdknUQJLurtRLPqo-VKrU1327uQ8GBnBjbGSb5KZR_nvHgMlXtyIS9njO-MyZGZRzUHCBJkhez4FkNQZJ8HvTBLPAnhq3MQcUFmlvVKszZ1mbTPPGbndyZ3ndKG3hDJZne7hAoVUNYY8JV-RBPgIt2AprhA18MpZZnIQ50_twuvLHNRrDSjRXj9fwiCJTBLIKdCsxq5j9EM4gtBU3QD8GjWBZd14xWYJqLTCZg2ViDyx1W4cz4dv0hsiB49FRHkyfsCgws3GjcTKZwmYLZ2feWc9o1W8zJQ2Fb62i5JUQRNRHgs-fx3WsisKg_RN5WVn4-WrvUd9VA9tH4-AcwbfFQIpkLWByvWzqSe2sk3kyjUlOec_XPU-3TRaz_75tuvKoi19e3OvipSpamVmupJM2F_gXnnJ1lBM8oLQjHceys8R7PMFms4HwD2lRhzeEe-EsvluSrHe2TJdo4wMTLY48XKwPzm0KGm2r5ajFtRYU4TWOY7-ddWHfxhDP0QkQhnf5PWRnVVkKnIx8fZsOb5dR16nwG4TCCRdCMphWQ7z1_DoOcp3zA2SCGbPZBa5jd0G_TRxmc36Me-mG6A7l60XIlMs8ce2-OXtrDyBItdz6qVjPadObzx-RZdV1nJjx64tXad1sz962njceOHfAzmk9JzrbXqg1lw3NkZL7vgE257t-uMDcO6attSSokpmgFqVMO2U93e_dDlzOUKsc-3t6zNZp6K9cG3sS2KGSUqiUiUmq8tNYoJwbmvpTAoXA96GyjCojI26xNglk6DpwOPm7NdRYp4ia0JL94bTqRiGB5WJxqFY37RGPoz3c6i4jP3rcUA7wmhqNywQW7om_YQ2L4UQdUBdCHSPiOQJ8bFcxHzeK0jKBY0XcV95SkCWlD9t-9eOM3TLKucauiyktJdpaPqT19ddF4wFHntsqgS-_XE01e48GMwnw02AtWZP02QyGVOkcNfk072CU4PkduZSWpVYt9SkcmJ64hPwHpWF5ziVls3wIFmmW89Y83vMeGf5PBxjcyPSkXNy10J18t3x6-a6CDtBq6SGklNKeazFyLahB3PVIGo2UbhOgGi9vKjzW_j6xVFFD17difXx5ebll0vwvkcGpn4sZ9MN3vqFYsJoL6gUuK9TcPrO_PxgzWMRfflSEr2NHPJf6lj1957rRpH8CNMG84JgHidUtXt4u_wK21LXERAgAAA==)

<!-- prettier-ignore -->
```svelte
<script>
  import { ---beforeUpdate, afterUpdate,--- tick } from 'svelte';

  ---let updatingMessages = false;---
  let theme = +++$state('dark')+++;
  let messages = +++$state([])+++;

  let viewport;

  ---beforeUpdate(() => {---
  +++$effect.pre(() => {+++
    ---if (!updatingMessages) return;---
    +++messages;+++
    const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;

    if (autoscroll) {
      tick().then(() => {
        viewport.scrollTo(0, viewport.scrollHeight);
      });
    }

    ---updatingMessages = false;---
  });

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      const text = event.target.value;
      if (!text) return;

      ---updatingMessages = true;---
      messages = [...messages, text];
      event.target.value = '';
    }
  }

  function toggle() {
    toggleValue = !toggleValue;
  }
</script>

<div class:dark={theme === 'dark'}>
  <div bind:this={viewport}>
    {#each messages as message}
      <p>{message}</p>
    {/each}
  </div>

  <input +++onkeydown+++={handleKeydown} />

  <button +++onclick+++={toggle}> Toggle dark mode </button>
</div>
```

## Imperative component API

<!-- better title needed?

- mount
- unmount
- render
- hydrate
- how they interact with each other -->

Every Svelte application starts by imperatively creating a root component. On the client this component is mounted to a specific element. On the server, you want to get back a string of HTML instead which you can render. The following functions help you achieve those tasks.

## `mount`

Instantiates a component and mounts it to the given target:

```js
// @errors: 2322
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
  target: document.querySelector('#app'),
  props: { some: 'property' }
});
```

You can mount multiple components per page, and you can also mount from within your application, for example when creating a tooltip component and attaching it to the hovered element.

Note that unlike calling `new App(...)` in Svelte 4, things like effects (including `onMount` callbacks, and action functions) will not run during `mount`. If you need to force pending effects to run (in the context of a test, for example) you can do so with `flushSync()`.

## `unmount`

Unmounts a component created with [`mount`](#mount) or [`hydrate`](#hydrate):

```js
// @errors: 1109
import { mount, unmount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {...});

// later
unmount(app);
```

## `render`

Only available on the server and when compiling with the `server` option. Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app:

```js
// @errors: 2724 2305 2307
import { render } from 'svelte/server';
import App from './App.svelte';

const result = render(App, {
  props: { some: 'property' }
});
result.body; // HTML for somewhere in this <body> tag
result.head; // HTML for somewhere in this <head> tag
```

## `hydrate`

Like `mount`, but will reuse up any HTML rendered by Svelte's SSR output (from the [`render`](#render) function) inside the target and make it interactive:

```js
// @errors: 2322
import { hydrate } from 'svelte';
import App from './App.svelte';

const app = hydrate(App, {
  target: document.querySelector('#app'),
  props: { some: 'property' }
});
```

As with `mount`, effects will not run during `hydrate` — use `flushSync()` immediately afterwards if you need them to.

# Misc

## Testing

Testing helps you write and maintain your code and guard against regressions. Testing frameworks help you with that, allowing you to describe assertions or expectations about how your code should behave. Svelte is unopinionated about which testing framework you use — you can write unit tests, integration tests, and end-to-end tests using solutions like [Vitest](https://vitest.dev/), [Jasmine](https://jasmine.github.io/), [Cypress](https://www.cypress.io/) and [Playwright](https://playwright.dev/).

## Unit and integration testing using Vitest

Unit tests allow you to test small isolated parts of your code. Integration tests allow you to test parts of your application to see if they work together. If you're using Vite (including via SvelteKit), we recommend using [Vitest](https://vitest.dev/).

To get started, install Vitest:

```bash
npm install -D vitest
```

Then adjust your `vite.config.js`:

<!-- prettier-ignore -->
```js
/// file: vite.config.js
import { defineConfig } from +++'vitest/config'+++;

export default defineConfig({ /* ... */ })
```

You can now write unit tests for code inside your `.js/.ts` files:

```js
/// file: multiplier.svelte.test.js
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.js';

test('Multiplier', () => {
  let double = multiplier(0, 2);

  expect(double.value).toEqual(0);

  double.set(5);

  expect(double.value).toEqual(10);
});
```

### Using runes inside your test files

It is possible to use runes inside your test files. First ensure your bundler knows to route the file through the Svelte compiler before running the test by adding `.svelte` to the filename (e.g `multiplier.svelte.test.js`). After that, you can use runes inside your tests.

```js
/// file: multiplier.svelte.test.js
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.svelte.js';

test('Multiplier', () => {
  let count = $state(0);
  let double = multiplier(() => count, 2);

  expect(double.value).toEqual(0);

  count = 5;

  expect(double.value).toEqual(10);
});
```

If the code being tested uses effects, you need to wrap the test inside `$effect.root`:

```js
/// file: logger.svelte.test.js
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { logger } from './logger.svelte.js';

test('Effect', () => {
  const cleanup = $effect.root(() => {
    let count = $state(0);

    // logger uses an $effect to log updates of its input
    let log = logger(() => count);

    // effects normally run after a microtask,
    // use flushSync to execute all pending effects synchronously
    flushSync();
    expect(log.value).toEqual([0]);

    count = 1;
    flushSync();

    expect(log.value).toEqual([0, 1]);
  });

  cleanup();
});
```

### Component testing

It is possible to test your components in isolation using Vitest.

> [!NOTE] Before writing component tests, think about whether you actually need to test the component, or if it's more about the logic _inside_ the component. If so, consider extracting out that logic to test it in isolation, without the overhead of a component

To get started, install jsdom (a library that shims DOM APIs):

```bash
npm install -D jsdom
```

Then adjust your `vite.config.js`:

```js
/// file: vite.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    /* ... */
  ],
  test: {
    // If you are testing components client-side, you need to setup a DOM environment.
    // If not all your files should have this environment, you can use a
    // `// @vitest-environment jsdom` comment at the top of the test files instead.
    environment: 'jsdom'
  },
  // Tell Vitest to use the `browser` entry points in `package.json` files, even though it's running in Node
  resolve: process.env.VITEST
    ? {
        conditions: ['browser']
      }
    : undefined
});
```

After that, you can create a test file in which you import the component to test, interact with it programmatically and write expectations about the results:

```js
/// file: component.test.js
import { flushSync, mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component', () => {
  // Instantiate the component using Svelte's `mount` API
  const component = mount(Component, {
    target: document.body, // `document` exists because of jsdom
    props: { initial: 0 }
  });

  expect(document.body.innerHTML).toBe('<button>0</button>');

  // Click the button, then flush the changes so you can synchronously write expectations
  document.body.querySelector('button').click();
  flushSync();

  expect(document.body.innerHTML).toBe('<button>1</button>');

  // Remove the component from the DOM
  unmount(component);
});
```

While the process is very straightforward, it is also low level and somewhat brittle, as the precise structure of your component may change frequently. Tools like [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/) can help streamline your tests. The above test could be rewritten like this:

```js
/// file: component.test.js
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component', async () => {
  const user = userEvent.setup();
  render(Component);

  const button = screen.getByRole('button');
  expect(button).toHaveTextContent(0);

  await user.click(button);
  expect(button).toHaveTextContent(1);
});
```

When writing component tests that involve two-way bindings, context or snippet props, it's best to create a wrapper component for your specific test and interact with that. `@testing-library/svelte` contains some [examples](https://testing-library.com/docs/svelte-testing-library/example).

## E2E tests using Playwright

E2E (short for 'end to end') tests allow you to test your full application through the eyes of the user. This section uses [Playwright](https://playwright.dev/) as an example, but you can also use other solutions like [Cypress](https://www.cypress.io/) or [NightwatchJS](https://nightwatchjs.org/).

To get start with Playwright, either let you guide by [their VS Code extension](https://playwright.dev/docs/getting-started-vscode), or install it from the command line using `npm init playwright`. It is also part of the setup CLI when you run `npx sv create`.

After you've done that, you should have a `tests` folder and a Playwright config. You may need to adjust that config to tell Playwright what to do before running the tests - mainly starting your application at a certain port:

```js
/// file: playwright.config.js
const config = {
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173
  },
  testDir: 'tests',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
```

You can now start writing tests. These are totally unaware of Svelte as a framework, so you mainly interact with the DOM and write assertions.

```js
// @errors: 2307 7031
/// file: tests/hello-world.spec.js
import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
```

## TypeScript

<!-- - [basically what we have today](https://svelte.dev/docs/typescript)
- built-in support, but only for type-only features
- generics
- using `Component` and the other helper types
- using `svelte-check` -->

You can use TypeScript within Svelte components. IDE extensions like the [Svelte VS Code extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) will help you catch errors right in your editor, and [`svelte-check`](https://www.npmjs.com/package/svelte-check) does the same on the command line, which you can integrate into your CI.

## `<script lang="ts">`

To use TypeScript inside your Svelte components, add `lang="ts"` to your `script` tags:

```svelte
<script lang="ts">
  let name: string = 'world';

  function greet(name: string) {
    alert(`Hello, ${name}!`);
  }
</script>

<button onclick={(e: Event) => greet(e.target.innerText)}>
  {name as string}
</button>
```

Doing so allows you to use TypeScript's _type-only_ features. That is, all features that just disappear when transpiling to JavaScript, such as type annotations or interface declarations. Features that require the TypeScript compiler to output actual code are not supported. This includes:

- using enums
- using `private`, `protected` or `public` modifiers in constructor functions together with initializers
- using features that are not yet part of the ECMAScript standard (i.e. not level 4 in the TC39 process) and therefore not implemented yet within Acorn, the parser we use for parsing JavaScript

If you want to use one of these features, you need to setup up a `script` preprocessor.

## Preprocessor setup

To use non-type-only TypeScript features within Svelte components, you need to add a preprocessor that will turn TypeScript into JavaScript.

### Using SvelteKit or Vite

The easiest way to get started is scaffolding a new SvelteKit project by typing `npx sv create`, following the prompts and choosing the TypeScript option.

```ts
/// file: svelte.config.js
// @noErrors
import { vitePreprocess } from '@sveltejs/kit/vite';

const config = {
  preprocess: vitePreprocess()
};

export default config;
```

If you don't need or want all the features SvelteKit has to offer, you can scaffold a Svelte-flavoured Vite project instead by typing `npm create vite@latest` and selecting the `svelte-ts` option.

```ts
/// file: svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess()
};

export default config;
```

In both cases, a `svelte.config.js` with `vitePreprocess` will be added. Vite/SvelteKit will read from this config file.

### Other build tools

If you're using tools like Rollup or Webpack instead, install their respective Svelte plugins. For Rollup that's [rollup-plugin-svelte](https://github.com/sveltejs/rollup-plugin-svelte) and for Webpack that's [svelte-loader](https://github.com/sveltejs/svelte-loader). For both, you need to install `typescript` and `svelte-preprocess` and add the preprocessor to the plugin config (see the respective READMEs for more info). If you're starting a new project, you can also use the [rollup](https://github.com/sveltejs/template) or [webpack](https://github.com/sveltejs/template-webpack) template to scaffold the setup from a script.

> [!NOTE] If you're starting a new project, we recommend using SvelteKit or Vite instead

## Typing `$props`

Type `$props` just like a regular object with certain properties.

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    requiredProperty: number;
    optionalProperty?: boolean;
    snippetWithStringArgument: Snippet<[string]>;
    eventHandler: (arg: string) => void;
    [key: string]: unknown;
  }

  let {
    requiredProperty,
    optionalProperty,
    snippetWithStringArgument,
    eventHandler,
    ...everythingElse
  }: Props = $props();
</script>

<button onclick={() => eventHandler('clicked button')}>
  {@render snippetWithStringArgument('hello')}
</button>
```

## Generic `$props`

Components can declare a generic relationship between their properties. One example is a generic list component that receives a list of items and a callback property that receives an item from the list. To declare that the `items` property and the `select` callback operate on the same types, add the `generics` attribute to the `script` tag:

```svelte
<script lang="ts" generics="Item extends { text: string }">
  interface Props {
    items: Item[];
    select(item: Item): void;
  }

  let { items, select }: Props = $props();
</script>

{#each items as item}
  <button onclick={() => select(item)}>
    {item.text}
  </button>
{/each}
```

The content of `generics` is what you would put between the `<...>` tags of a generic function. In other words, you can use multiple generics, `extends` and fallback types.

## Typing wrapper components

In case you're writing a component that wraps a native element, you may want to expose all the attributes of underlying element to the user. In that case, use (or extend from) one of the interfaces provided by `svelte/elements`. Here's an example for a `Button` component:

```svelte
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  let { children, ...rest }: HTMLButtonAttributes = $props();
</script>

<button {...rest}>
  {@render children()}
</button>
```

## Typing `$state`

You can type `$state` like any other variable.

```ts
let count: number = $state(0);
```

If you don't give `$state` an initial value, part of its types will be `undefined`.

```ts
// @noErrors
// Error: Type 'number | undefined' is not assignable to type 'number'
let count: number = $state();
```

If you know that the variable _will_ be defined before you first use it, use an `as` casting. This is especially useful in the context of classes:

```ts
class Counter {
  count = $state() as number;
  constructor(initial: number) {
    this.count = initial;
  }
}
```

## The `Component` type

Svelte components are of type `Component`. You can use it and its related types to express a variety of constraints.

Using it together with dynamic components to restrict what kinds of component can be passed to it:

```svelte
<script lang="ts">
  import type { Component } from 'svelte';

  interface Props {
    // only components that have at most the "prop"
    // property required can be passed
    DynamicComponent: Component<{ prop: string }>;
  }

  let { DynamicComponent }: Props = $props();
</script>

<DynamicComponent prop="foo" />
```

Closely related to the `Component` type is the `ComponentProps` type which extracts the properties a component expects.

```ts
import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';

function withProps<TComponent extends Component<any>>(
  component: TComponent,
  props: ComponentProps<TComponent>
) {}

// Errors if the second argument is not the correct props expected
// by the component in the first argument.
withProps(MyComponent, { foo: 'bar' });
```

## Enhancing built-in DOM types

Svelte provides a best effort of all the HTML DOM types that exist. Sometimes you may want to use experimental attributes or custom events coming from an action. In these cases, TypeScript will throw a type error, saying that it does not know these types. If it's a non-experimental standard attribute/event, this may very well be a missing typing from our [HTML typings](https://github.com/sveltejs/svelte/blob/main/packages/svelte/elements.d.ts). In that case, you are welcome to open an issue and/or a PR fixing it.

In case this is a custom or experimental attribute/event, you can enhance the typings like this:

```ts
/// file: additional-svelte-typings.d.ts
declare namespace svelteHTML {
  // enhance elements
  interface IntrinsicElements {
    'my-custom-element': { someattribute: string; 'on:event': (e: CustomEvent<any>) => void };
  }
  // enhance attributes
  interface HTMLAttributes<T> {
    // If you want to use the beforeinstallprompt event
    onbeforeinstallprompt?: (event: any) => any;
    // If you want to use myCustomAttribute={..} (note: all lowercase)
    mycustomattribute?: any; // You can replace any with something more specific if you like
  }
}
```

Then make sure that `d.ts` file is referenced in your `tsconfig.json`. If it reads something like `"include": ["src/**/*"]` and your `d.ts` file is inside `src`, it should work. You may need to reload for the changes to take effect.

You can also declare the typings by augmenting the `svelte/elements` module like this:

```ts
/// file: additional-svelte-typings.d.ts
import { HTMLButtonAttributes } from 'svelte/elements';

declare module 'svelte/elements' {
  export interface SvelteHTMLElements {
    'custom-button': HTMLButtonAttributes;
  }

  // allows for more granular control over what element to add the typings to
  export interface HTMLButtonAttributes {
    veryexperimentalattribute?: string;
  }
}

export {}; // ensure this is not an ambient module, else types will be overridden instead of augmented
```

## Custom elements

<!-- - [basically what we have today](https://svelte.dev/docs/custom-elements-api) -->

Svelte components can also be compiled to custom elements (aka web components) using the `customElement: true` compiler option. You should specify a tag name for the component using the `<svelte:options>` [element](svelte-options).

```svelte
<svelte:options customElement="my-element" />

<script>
  let { name = 'world' } = $props();
</script>

<h1>Hello {name}!</h1>
<slot />
```

You can leave out the tag name for any of your inner components which you don't want to expose and use them like regular Svelte components. Consumers of the component can still name it afterwards if needed, using the static `element` property which contains the custom element constructor and which is available when the `customElement` compiler option is `true`.

```js
// @noErrors
import MyElement from './MyElement.svelte';

customElements.define('my-element', MyElement.element);
```

Once a custom element has been defined, it can be used as a regular DOM element:

```js
document.body.innerHTML = `
  <my-element>
    <p>This is some slotted content</p>
  </my-element>
`;
```

Any [props](basic-markup#Component-props) are exposed as properties of the DOM element (as well as being readable/writable as attributes, where possible).

```js
// @noErrors
const el = document.querySelector('my-element');

// get the current value of the 'name' prop
console.log(el.name);

// set a new value, updating the shadow DOM
el.name = 'everybody';
```

## Component lifecycle

Custom elements are created from Svelte components using a wrapper approach. This means the inner Svelte component has no knowledge that it is a custom element. The custom element wrapper takes care of handling its lifecycle appropriately.

When a custom element is created, the Svelte component it wraps is _not_ created right away. It is only created in the next tick after the `connectedCallback` is invoked. Properties assigned to the custom element before it is inserted into the DOM are temporarily saved and then set on component creation, so their values are not lost. The same does not work for invoking exported functions on the custom element though, they are only available after the element has mounted. If you need to invoke functions before component creation, you can work around it by using the [`extend` option](#Component-options).

When a custom element written with Svelte is created or updated, the shadow DOM will reflect the value in the next tick, not immediately. This way updates can be batched, and DOM moves which temporarily (but synchronously) detach the element from the DOM don't lead to unmounting the inner component.

The inner Svelte component is destroyed in the next tick after the `disconnectedCallback` is invoked.

## Component options

When constructing a custom element, you can tailor several aspects by defining `customElement` as an object within `<svelte:options>` since Svelte 4. This object may contain the following properties:

- `tag: string`: an optional `tag` property for the custom element's name. If set, a custom element with this tag name will be defined with the document's `customElements` registry upon importing this component.
- `shadow`: an optional property that can be set to `"none"` to forgo shadow root creation. Note that styles are then no longer encapsulated, and you can't use slots
- `props`: an optional property to modify certain details and behaviors of your component's properties. It offers the following settings:
  - `attribute: string`: To update a custom element's prop, you have two alternatives: either set the property on the custom element's reference as illustrated above or use an HTML attribute. For the latter, the default attribute name is the lowercase property name. Modify this by assigning `attribute: "<desired name>"`.
  - `reflect: boolean`: By default, updated prop values do not reflect back to the DOM. To enable this behavior, set `reflect: true`.
  - `type: 'String' | 'Boolean' | 'Number' | 'Array' | 'Object'`: While converting an attribute value to a prop value and reflecting it back, the prop value is assumed to be a `String` by default. This may not always be accurate. For instance, for a number type, define it using `type: "Number"`
    You don't need to list all properties, those not listed will use the default settings.
- `extend`: an optional property which expects a function as its argument. It is passed the custom element class generated by Svelte and expects you to return a custom element class. This comes in handy if you have very specific requirements to the life cycle of the custom element or want to enhance the class to for example use [ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals#examples) for better HTML form integration.

```svelte
<svelte:options
  customElement={{
    tag: 'custom-element',
    shadow: 'none',
    props: {
      name: { reflect: true, type: 'Number', attribute: 'element-index' }
    },
    extend: (customElementConstructor) => {
      // Extend the class so we can let it participate in HTML forms
      return class extends customElementConstructor {
        static formAssociated = true;

        constructor() {
          super();
          this.attachedInternals = this.attachInternals();
        }

        // Add the function here, not below in the component so that
        // it's always available, not just when the inner Svelte component
        // is mounted
        randomIndex() {
          this.elementIndex = Math.random();
        }
      };
    }
  }}
/>

<script>
  let { elementIndex, attachedInternals } = $props();
  // ...
  function check() {
    attachedInternals.checkValidity();
  }
</script>

...
```

## Caveats and limitations

Custom elements can be a useful way to package components for consumption in a non-Svelte app, as they will work with vanilla HTML and JavaScript as well as [most frameworks](https://custom-elements-everywhere.com/). There are, however, some important differences to be aware of:

- Styles are _encapsulated_, rather than merely _scoped_ (unless you set `shadow: "none"`). This means that any non-component styles (such as you might have in a `global.css` file) will not apply to the custom element, including styles with the `:global(...)` modifier
- Instead of being extracted out as a separate .css file, styles are inlined into the component as a JavaScript string
- Custom elements are not generally suitable for server-side rendering, as the shadow DOM is invisible until JavaScript loads
- In Svelte, slotted content renders _lazily_. In the DOM, it renders _eagerly_. In other words, it will always be created even if the component's `<slot>` element is inside an `{#if ...}` block. Similarly, including a `<slot>` in an `{#each ...}` block will not cause the slotted content to be rendered multiple times
- The deprecated `let:` directive has no effect, because custom elements do not have a way to pass data to the parent component that fills the slot
- Polyfills are required to support older browsers
- You can use Svelte's context feature between regular Svelte components within a custom element, but you can't use them across custom elements. In other words, you can't use `setContext` on a parent custom element and read that with `getContext` in a child custom element.

## Svelte 5 migration guide

Version 5 comes with an overhauled syntax and reactivity system. While it may look different at first, you'll soon notice many similarities. This guide goes over the changes in detail and shows you how to upgrade. Along with it, we also provide information on _why_ we did these changes.

You don't have to migrate to the new syntax right away - Svelte 5 still supports the old Svelte 4 syntax, and you can mix and match components using the new syntax with components using the old and vice versa. We expect many people to be able to upgrade with only a few lines of code changed initially. There's also a [migration script](#Migration-script) that helps you with many of these steps automatically.

## Reactivity syntax changes

At the heart of Svelte 5 is the new runes API. Runes are basically compiler instructions that inform Svelte about reactivity. Syntactically, runes are functions starting with a dollar-sign.

### let -> $state

In Svelte 4, a `let` declaration at the top level of a component was implicitly reactive. In Svelte 5, things are more explicit: a variable is reactive when created using the `$state` rune. Let's migrate the counter to runes mode by wrapping the counter in `$state`:

```svelte
<script>
  let count = +++$state(+++0+++)+++;
</script>
```

Nothing else changes. `count` is still the number itself, and you read and write directly to it, without a wrapper like `.value` or `getCount()`.

> [!DETAILS] Why we did this
> `let` being implicitly reactive at the top level worked great, but it meant that reactivity was constrained - a `let` declaration anywhere else was not reactive. This forced you to resort to using stores when refactoring code out of the top level of components for reuse. This meant you had to learn an entirely separate reactivity model, and the result often wasn't as nice to work with. Because reactivity is more explicit in Svelte 5, you can keep using the same API outside the top level of components. Head to [the tutorial](/tutorial) to learn more.

### $: -> $derived/$effect

In Svelte 4, a `$:` statement at the top level of a component could be used to declare a derivation, i.e. state that is entirely defined through a computation of other state. In Svelte 5, this is achieved using the `$derived` rune:

```svelte
<script>
  let count = +++$state(+++0+++)+++;
  ---$:--- +++const+++ double = +++$derived(+++count * 2+++)+++;
</script>
```

As with `$state`, nothing else changes. `double` is still the number itself, and you read it directly, without a wrapper like `.value` or `getCount()`.

A `$:` statement could also be used to create side effects. In Svelte 5, this is achieved using the `$effect` rune:

```svelte
<script>
  let count = +++$state(+++0+++)+++;
  ---$:---+++$effect(() =>+++ {
    if (count > 5) {
      alert('Count is too high!');
    }
  }+++);+++
</script>
```

> [!DETAILS] Why we did this
> `$:` was a great shorthand and easy to get started with: you could slap a `$:` in front of most code and it would somehow work. This intuitiveness was also its drawback the more complicated your code became, because it wasn't as easy to reason about. Was the intent of the code to create a derivation, or a side effect? With `$derived` and `$effect`, you have a bit more up-front decision making to do (spoiler alert: 90% of the time you want `$derived`), but future-you and other developers on your team will have an easier time.
>
> There were also gotchas that were hard to spot:
>
> - `$:` only updated directly before rendering, which meant you could read stale values in-between rerenders
> - `$:` only ran once per tick, which meant that statements may run less often than you think
> - `$:` dependencies were determined through static analysis of the dependencies. This worked in most cases, but could break in subtle ways during a refactoring where dependencies would be for example moved into a function and no longer be visible as a result
> - `$:` statements were also ordered by using static analysis of the dependencies. In some cases there could be ties and the ordering would be wrong as a result, needing manual interventions. Ordering could also break while refactoring code and some dependencies no longer being visible as a result.
>
> Lastly, it wasn't TypeScript-friendly (our editor tooling had to jump through some hoops to make it valid for TypeScript), which was a blocker for making Svelte's reactivity model truly universal.
>
> `$derived` and `$effect` fix all of these by
>
> - always returning the latest value
> - running as often as needed to be stable
> - determining the dependencies at runtime, and therefore being immune to refactorings
> - executing dependencies as needed and therefore being immune to ordering problems
> - being TypeScript-friendly

### export let -> $props

In Svelte 4, properties of a component were declared using `export let`. Each property was one declaration. In Svelte 5, all properties are declared through the `$props` rune, through destructuring:

```svelte
<script>
  ---export let optional = 'unset';
  export let required;---
  +++let { optional = 'unset', required } = $props();+++
</script>
```

There are multiple cases where declaring properties becomes less straightforward than having a few `export let` declarations:

- you want to rename the property, for example because the name is a reserved identifier (e.g. `class`)
- you don't know which other properties to expect in advance
- you want to forward every property to another component

All these cases need special syntax in Svelte 4:

- renaming: `export { klass as class}`
- other properties: `$$restProps`
- all properties `$$props`

In Svelte 5, the `$props` rune makes this straightforward without any additional Svelte-specific syntax:

- renaming: use property renaming `let { class: klass } = $props();`
- other properties: use spreading `let { foo, bar, ...rest } = $props();`
- all properties: don't destructure `let props = $props();`

```svelte
<script>
  ---let klass = '';
  export { klass as class};---
  +++let { class: klass, ...rest } = $props();+++
</script>
<button class={klass} {...---$$restProps---+++rest+++}>click me</button>
```

> [!DETAILS] Why we did this
> `export let` was one of the more controversial API decisions, and there was a lot of debate about whether you should think about a property being `export`ed or `import`ed. `$props` doesn't have this trait. It's also in line with the other runes, and the general thinking reduces to "everything special to reactivity in Svelte is a rune".
>
> There were also a lot of limitations around `export let`, which required additional API, as shown above. `$props` unite this in one syntactical concept that leans heavily on regular JavaScript destructuring syntax.

## Event changes

Event handlers have been given a facelift in Svelte 5. Whereas in Svelte 4 we use the `on:` directive to attach an event listener to an element, in Svelte 5 they are properties like any other (in other words - remove the colon):

```svelte
<script>
  let count = $state(0);
</script>

<button on---:---click={() => count++}>
  clicks: {count}
</button>
```

Since they're just properties, you can use the normal shorthand syntax...

```svelte
<script>
  let count = $state(0);

  function onclick() {
    count++;
  }
</script>

<button {onclick}>
  clicks: {count}
</button>
```

...though when using a named event handler function it's usually better to use a more descriptive name.

### Component events

In Svelte 4, components could emit events by creating a dispatcher with `createEventDispatcher`.

This function is deprecated in Svelte 5. Instead, components should accept _callback props_ - which means you then pass functions as properties to these components:

```svelte
<!--- file: App.svelte --->
<script>
  import Pump from './Pump.svelte';

  let size = $state(15);
  let burst = $state(false);

  function reset() {
    size = 15;
    burst = false;
  }
</script>

<Pump
  ---on:---inflate={(power) => {
    size += power---.details---;
    if (size > 75) burst = true;
  }}
  ---on:---deflate={(power) => {
    if (size > 0) size -= power---.details---;
  }}
/>

{#if burst}
  <button onclick={reset}>new balloon</button>
  <span class="boom">💥</span>
{:else}
  <span class="balloon" style="scale: {0.01 * size}">
    🎈
  </span>
{/if}
```

```svelte
<!--- file: Pump.svelte --->
<script>
    ---import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    ---
  +++let { inflate, deflate } = $props();+++
  let power = $state(5);
</script>

<button onclick={() => ---dispatch('inflate', power)---+++inflate(power)+++}>
  inflate
</button>
<button onclick={() => ---dispatch('deflate', power)---+++deflate(power)+++}>
  deflate
</button>
<button onclick={() => power--}>-</button>
Pump power: {power}
<button onclick={() => power++}>+</button>
```

### Bubbling events

Instead of doing `<button on:click>` to 'forward' the event from the element to the component, the component should accept an `onclick` callback prop:

```svelte
<script>
  +++let { onclick } = $props();+++
</script>

<button ---on:click--- +++{onclick}+++>
  click me
</button>
```

Note that this also means you can 'spread' event handlers onto the element along with other props instead of tediously forwarding each event separately:

```svelte
<script>
  let props = $props();
</script>

<button ---{...$$props} on:click on:keydown on:all_the_other_stuff--- +++{...props}+++>
  click me
</button>
```

### Event modifiers

In Svelte 4, you can add event modifiers to handlers:

```svelte
<button on:click|once|preventDefault={handler}>...</button>
```

Modifiers are specific to `on:` and as such do not work with modern event handlers. Adding things like `event.preventDefault()` inside the handler itself is preferable, since all the logic lives in one place rather than being split between handler and modifiers.

Since event handlers are just functions, you can create your own wrappers as necessary:

```svelte
<script>
  function once(fn) {
    return function (event) {
      if (fn) fn.call(this, event);
      fn = null;
    };
  }

  function preventDefault(fn) {
    return function (event) {
      event.preventDefault();
      fn.call(this, event);
    };
  }
</script>

<button onclick={once(preventDefault(handler))}>...</button>
```

There are three modifiers — `capture`, `passive` and `nonpassive` — that can't be expressed as wrapper functions, since they need to be applied when the event handler is bound rather than when it runs.

For `capture`, we add the modifier to the event name:

```svelte
<button onclickcapture={...}>...</button>
```

Changing the [`passive`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners) option of an event handler, meanwhile, is not something to be done lightly. If you have a use case for it — and you probably don't! — then you will need to use an action to apply the event handler yourself.

### Multiple event handlers

In Svelte 4, this is possible:

```svelte
<button on:click={one} on:click={two}>...</button>
```

Duplicate attributes/properties on elements — which now includes event handlers — are not allowed. Instead, do this:

```svelte
<button
  onclick={(e) => {
    one(e);
    two(e);
  }}
>
  ...
</button>
```

When spreading props, local event handlers must go _after_ the spread, or they risk being overwritten:

```svelte
<button
  {...props}
  onclick={(e) => {
    doStuff(e);
    props.onclick?.(e);
  }}
>
  ...
</button>
```

> [!DETAILS] Why we did this
> `createEventDispatcher` was always a bit boilerplate-y:
>
> - import the function
> - call the function to get a dispatch function
> - call said dispatch function with a string and possibly a payload
> - retrieve said payload on the other end through a `.details` property, because the event itself was always a `CustomEvent`
>
> It was always possible to use component callback props, but because you had to listen to DOM events using `on:`, it made sense to use `createEventDispatcher` for component events due to syntactical consistency. Now that we have event attributes (`onclick`), it's the other way around: Callback props are now the more sensible thing to do.
>
> The removal of event modifiers is arguably one of the changes that seems like a step back for those who've liked the shorthand syntax of event modifiers. Given that they are not used that frequently, we traded a smaller surface area for more explicitness. Modifiers also were inconsistent, because most of them were only useable on DOM elements.
>
> Multiple listeners for the same event are also no longer possible, but it was something of an anti-pattern anyway, since it impedes readability: if there are many attributes, it becomes harder to spot that there are two handlers unless they are right next to each other. It also implies that the two handlers are independent, when in fact something like `event.stopImmediatePropagation()` inside `one` would prevent `two` from being called.
>
> By deprecating `createEventDispatcher` and the `on:` directive in favour of callback props and normal element properties, we:
>
> - reduce Svelte's learning curve
> - remove boilerplate, particularly around `createEventDispatcher`
> - remove the overhead of creating `CustomEvent` objects for events that may not even have listeners
> - add the ability to spread event handlers
> - add the ability to know which event handlers were provided to a component
> - add the ability to express whether a given event handler is required or optional
> - increase type safety (previously, it was effectively impossible for Svelte to guarantee that a component didn't emit a particular event)

## Snippets instead of slots

In Svelte 4, content can be passed to components using slots. Svelte 5 replaces them with snippets which are more powerful and flexible, and as such slots are deprecated in Svelte 5.

They continue to work, however, and you can mix and match snippets and slots in your components.

When using custom elements, you should still use `<slot />` like before. In a future version, when Svelte removes its internal version of slots, it will leave those slots as-is, i.e. output a regular DOM tag instead of transforming it.

### Default content

In Svelte 4, the easiest way to pass a piece of UI to the child was using a `<slot />`. In Svelte 5, this is done using the `children` prop instead, which is then shown with `{@render children()}`:

```svelte
<script>
  +++let { children } = $props();+++
</script>

---<slot />---
+++{@render children?.()}+++
```

### Multiple content placeholders

If you wanted multiple UI placeholders, you had to use named slots. In Svelte 5, use props instead, name them however you like and `{@render ...}` them:

```svelte
<script>
  +++let { header, main, footer } = $props();+++
</script>

<header>
  ---<slot name="header" />---
  +++{@render header()}+++
</header>

<main>
  ---<slot name="main" />---
  +++{@render main()}+++
</main>

<footer>
  ---<slot name="header" />---
  +++{@render footer()}+++
</footer>
```

### Passing data back up

In Svelte 4, you would pass data to a `<slot />` and then retrieve it with `let:` in the parent component. In Svelte 5, snippets take on that responsibility:

```svelte
<!--- file: App.svelte --->
<script>
  import List from './List.svelte';
</script>

<List items={['one', 'two', 'three']} ---let:item--->
  +++{#snippet item(text)}+++
    <span>{text}</span>
  +++{/snippet}+++
  ---<span slot="empty">No items yet</span>---
  +++{#snippet empty()}
    <span>No items yet</span>
  {/snippet}+++
</List>
```

```svelte
<!--- file: List.svelte --->
<script>
  let { items, +++item, empty+++ } = $props();
</script>

{#if items.length}
  <ul>
    {#each items as entry}
      <li>
        ---<slot item={entry} />---
        +++{@render item(entry)}+++
      </li>
    {/each}
  </ul>
{:else}
  ---<slot name="empty" />---
  +++{@render empty?.()}+++
{/if}
```

> [!DETAILS] Why we did this
> Slots were easy to get started with, but the more advanced the use case became, the more involved and confusing the syntax became:
>
> - the `let:` syntax was confusing to many people as it _creates_ a variable whereas all other `:` directives _receive_ a variable
> - the scope of a variable declared with `let:` wasn't clear. In the example above, it may look like you can use the `item` slot prop in the `empty` slot, but that's not true
> - named slots had to be applied to an element using the `slot` attribute. Sometimes you didn't want to create an element, so we had to add the `<svelte:fragment>` API
> - named slots could also be applied to a component, which changed the semantics of where `let:` directives are available (even today us maintainers often don't know which way around it works)
>
> Snippets solve all of these problems by being much more readable and clear. At the same time they're more powerful as they allow you to define sections of UI that you can render _anywhere_, not just passing them as props to a component.

## Migration script

By now you should have a pretty good understanding of the before/after and how the old syntax relates to the new syntax. It probably also became clear that a lot of these migrations are rather technical and repetitive - something you don't want to do by hand.

We thought the same, which is why we provide a migration script to do most of the migration automatically. You can upgrade your project by using `npx sv migrate svelte-5`. This will do the following things:

- bump core dependencies in your `package.json`
- migrate to runes (`let` -> `$state` etc)
- migrate to event attributes for DOM elements (`on:click` -> `onclick`)
- migrate slot creations to render tags (`<slot />` -> `{@render children()}`)
- migrate slot usages to snippets (`<div slot="x">...</div>` -> `{#snippet x()}<div>...</div>{/snippet}`)
- migrate obvious component creations (`new Component(...)` -> `mount(Component, ...)`)

You can also migrate a single component in VS Code through the `Migrate Component to Svelte 5 Syntax` command, or in our Playground through the `Migrate` button.

Not everything can be migrated automatically, and some migrations need manual cleanup afterwards. The following sections describe these in more detail.

### run

You may see that the migration script converts some of your `$:` statements to a `run` function which is imported from `svelte/legacy`. This happens if the migration script couldn't reliably migrate the statement to a `$derived` and concluded this is a side effect instead. In some cases this may be wrong and it's best to change this to use a `$derived` instead. In other cases it may be right, but since `$:` statements also ran on the server but `$effect` does not, it isn't safe to transform it as such. Instead, `run` is used as a stopgap solution. `run` mimics most of the characteristics of `$:`, in that it runs on the server once, and runs as `$effect.pre` on the client (`$effect.pre` runs _before_ changes are applied to the DOM; most likely you want to use `$effect` instead).

```svelte
<script>
  ---import { run } from 'svelte/legacy';---
  ---run(() => {---
  +++$effect(() => {+++
    // some side effect code
  })
</script>
```

### Event modifiers

Event modifiers are not applicable to event attributes (e.g. you can't do `onclick|preventDefault={...}`). Therefore, when migrating event directives to event attributes, we need a function-replacement for these modifiers. These are imported from `svelte/legacy`, and should be migrated away from in favor of e.g. just using `event.preventDefault()`.

```svelte
<script>
  ---import { preventDefault } from 'svelte/legacy';---
</script>

<button
  onclick={---preventDefault---((event) => {
    +++event.preventDefault();+++
    // ...
  })}
>
  click me
</button>
```

### Things that are not automigrated

The migration script does not convert `createEventDispatcher`. You need to adjust those parts manually. It doesn't do it because it's too risky because it could result in breakage for users of the component, which the migration script cannot find out.

The migration script does not convert `beforeUpdate/afterUpdate`. It doesn't do it because it's impossible to determine the actual intent of the code. As a rule of thumb you can often go with a combination of `$effect.pre` (runs at the same time as `beforeUpdate` did) and `tick` (imported from `svelte`, allows you to wait until changes are applied to the DOM and then do some work).

## Components are no longer classes

In Svelte 3 and 4, components are classes. In Svelte 5 they are functions and should be instantiated differently. If you need to manually instantiate components, you should use `mount` or `hydrate` (imported from `svelte`) instead. If you see this error using SvelteKit, try updating to the latest version of SvelteKit first, which adds support for Svelte 5. If you're using Svelte without SvelteKit, you'll likely have a `main.js` file (or similar) which you need to adjust:

```js
+++import { mount } from 'svelte';+++
import App from './App.svelte'

---const app = new App({ target: document.getElementById("app") });---
+++const app = mount(App, { target: document.getElementById("app") });+++

export default app;
```

`mount` and `hydrate` have the exact same API. The difference is that `hydrate` will pick up the Svelte's server-rendered HTML inside its target and hydrate it. Both return an object with the exports of the component and potentially property accessors (if compiled with `accessors: true`). They do not come with the `$on`, `$set` and `$destroy` methods you may know from the class component API. These are its replacements:

For `$on`, instead of listening to events, pass them via the `events` property on the options argument.

```js
+++import { mount } from 'svelte';+++
import App from './App.svelte'

---const app = new App({ target: document.getElementById("app") });
app.$on('event', callback);---
+++const app = mount(App, { target: document.getElementById("app"), events: { event: callback } });+++
```

> [!NOTE] Note that using `events` is discouraged — instead, [use callbacks](#Event-changes)

For `$set`, use `$state` instead to create a reactive property object and manipulate it. If you're doing this inside a `.js` or `.ts` file, adjust the ending to include `.svelte`, i.e. `.svelte.js` or `.svelte.ts`.

```js
+++import { mount } from 'svelte';+++
import App from './App.svelte'

---const app = new App({ target: document.getElementById("app"), props: { foo: 'bar' } });
app.$set({ foo: 'baz' });---
+++const props = $state({ foo: 'bar' });
const app = mount(App, { target: document.getElementById("app"), props });
props.foo = 'baz';+++
```

For `$destroy`, use `unmount` instead.

```js
+++import { mount, unmount } from 'svelte';+++
import App from './App.svelte'

---const app = new App({ target: document.getElementById("app"), props: { foo: 'bar' } });
app.$destroy();---
+++const app = mount(App, { target: document.getElementById("app") });
unmount(app);+++
```

As a stop-gap-solution, you can also use `createClassComponent` or `asClassComponent` (imported from `svelte/legacy`) instead to keep the same API known from Svelte 4 after instantiating.

```js
+++import { createClassComponent } from 'svelte/legacy';+++
import App from './App.svelte'

---const app = new App({ target: document.getElementById("app") });---
+++const app = createClassComponent({ component: App, target: document.getElementById("app") });+++

export default app;
```

If this component is not under your control, you can use the `compatibility.componentApi` compiler option for auto-applied backwards compatibility, which means code using `new Component(...)` keeps working without adjustments (note that this adds a bit of overhead to each component). This will also add `$set` and `$on` methods for all component instances you get through `bind:this`.

```js
/// svelte.config.js
export default {
  compilerOptions: {
    compatibility: {
      componentApi: 4
    }
  }
};
```

Note that `mount` and `hydrate` are _not_ synchronous, so things like `onMount` won't have been called by the time the function returns and the pending block of promises will not have been rendered yet (because `#await` waits a microtask to wait for a potentially immediately-resolved promise). If you need that guarantee, call `flushSync` (import from `'svelte'`) after calling `mount/hydrate`.

### Server API changes

Similarly, components no longer have a `render` method when compiled for server side rendering. Instead, pass the function to `render` from `svelte/server`:

```js
+++import { render } from 'svelte/server';+++
import App from './App.svelte';

---const { html, head } = App.render({ props: { message: 'hello' }});---
+++const { html, head } = render(App, { props: { message: 'hello' }});+++
```

In Svelte 4, rendering a component to a string also returned the CSS of all components. In Svelte 5, this is no longer the case by default because most of the time you're using a tooling chain that takes care of it in other ways (like SvelteKit). If you need CSS to be returned from `render`, you can set the `css` compiler option to `'injected'` and it will add `<style>` elements to the `head`.

### Component typing changes

The change from classes towards functions is also reflected in the typings: `SvelteComponent`, the base class from Svelte 4, is deprecated in favour of the new `Component` type which defines the function shape of a Svelte component. To manually define a component shape in a `d.ts` file:

```ts
import type { Component } from 'svelte';
export declare const MyComponent: Component<{
  foo: string;
}>;
```

To declare that a component of a certain type is required:

```svelte
<script lang="ts">
  import type { Component } from 'svelte';
  import {
    ComponentA,
    ComponentB
  } from 'component-library';

  let component: Component<{ foo: string }> = $state(
    Math.random() ? ComponentA : ComponentB
  );
</script>

<svelte:component this={component} foo="bar" />
```

The two utility types `ComponentEvents` and `ComponentType` are also deprecated. `ComponentEvents` is obsolete because events are defined as callback props now, and `ComponentType` is obsolete because the new `Component` type is the component type already (e.g. `ComponentType<SvelteComponent<{ prop: string }>>` == `Component<{ prop: string }>`).

### bind:this changes

Because components are no longer classes, using `bind:this` no longer returns a class instance with `$set`, `$on` and `$destroy` methods on it. It only returns the instance exports (`export function/const`) and, if you're using the `accessors` option, a getter/setter-pair for each property.

## Whitespace handling changed

Previously, Svelte employed a very complicated algorithm to determine if whitespace should be kept or not. Svelte 5 simplifies this which makes it easier to reason about as a developer. The rules are:

- Whitespace between nodes is collapsed to one whitespace
- Whitespace at the start and end of a tag is removed completely
- Certain exceptions apply such as keeping whitespace inside `pre` tags

As before, you can disable whitespace trimming by setting the `preserveWhitespace` option in your compiler settings or on a per-component basis in `<svelte:options>`.

## Modern browser required

Svelte 5 requires a modern browser (in other words, not Internet Explorer) for various reasons:

- it uses [`Proxies`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- elements with `clientWidth`/`clientHeight`/`offsetWidth`/`offsetHeight` bindings use a [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) rather than a convoluted `<iframe>` hack
- `<input type="range" bind:value={...} />` only uses an `input` event listener, rather than also listening for `change` events as a fallback

The `legacy` compiler option, which generated bulkier but IE-friendly code, no longer exists.

## Changes to compiler options

- The `false`/`true` (already deprecated previously) and the `"none"` values were removed as valid values from the `css` option
- The `legacy` option was repurposed
- The `hydratable` option has been removed. Svelte components are always hydratable now
- The `enableSourcemap` option has been removed. Source maps are always generated now, tooling can choose to ignore it
- The `tag` option was removed. Use `<svelte:options customElement="tag-name" />` inside the component instead
- The `loopGuardTimeout`, `format`, `sveltePath`, `errorMode` and `varsReport` options were removed

## The `children` prop is reserved

Content inside component tags becomes a snippet prop called `children`. You cannot have a separate prop by that name.

## Dot notation indicates a component

In Svelte 4, `<foo.bar>` would create an element with a tag name of `"foo.bar"`. In Svelte 5, `foo.bar` is treated as a component instead. This is particularly useful inside `each` blocks:

```svelte
{#each items as item}
  <item.component {...item.props} />
{/each}
```

## Breaking changes in runes mode

Some breaking changes only apply once your component is in runes mode.

### Bindings to component exports are not allowed

Exports from runes mode components cannot be bound to directly. For example, having `export const foo = ...` in component `A` and then doing `<A bind:foo />` causes an error. Use `bind:this` instead — `<A bind:this={a} />` — and access the export as `a.foo`. This change makes things easier to reason about, as it enforces a clear separation between props and exports.

### Bindings need to be explicitly defined using `$bindable()`

In Svelte 4 syntax, every property (declared via `export let`) is bindable, meaning you can `bind:` to it. In runes mode, properties are not bindable by default: you need to denote bindable props with the `$bindable` rune.

If a bindable property has a default value (e.g. `let { foo = $bindable('bar') } = $props();`), you need to pass a non-`undefined` value to that property if you're binding to it. This prevents ambiguous behavior — the parent and child must have the same value — and results in better performance (in Svelte 4, the default value was reflected back to the parent, resulting in wasteful additional render cycles).

### `accessors` option is ignored

Setting the `accessors` option to `true` makes properties of a component directly accessible on the component instance. In runes mode, properties are never accessible on the component instance. You can use component exports instead if you need to expose them.

### `immutable` option is ignored

Setting the `immutable` option has no effect in runes mode. This concept is replaced by how `$state` and its variations work.

### Classes are no longer "auto-reactive"

In Svelte 4, doing the following triggered reactivity:

```svelte
<script>
  let foo = new Foo();
</script>

<button on:click={() => (foo.value = 1)}>{foo.value}</button
>
```

This is because the Svelte compiler treated the assignment to `foo.value` as an instruction to update anything that referenced `foo`. In Svelte 5, reactivity is determined at runtime rather than compile time, so you should define `value` as a reactive `$state` field on the `Foo` class. Wrapping `new Foo()` with `$state(...)` will have no effect — only vanilla objects and arrays are made deeply reactive.

### `<svelte:component>` is no longer necessary

In Svelte 4, components are _static_ — if you render `<Thing>`, and the value of `Thing` changes, [nothing happens](/playground/7f1fa24f0ab44c1089dcbb03568f8dfa?version=4.2.18). To make it dynamic you must use `<svelte:component>`.

This is no longer true in Svelte 5:

```svelte
<script>
  import A from './A.svelte';
  import B from './B.svelte';

  let Thing = $state();
</script>

<select bind:value={Thing}>
  <option value={A}>A</option>
  <option value={B}>B</option>
</select>

<!-- these are equivalent -->
<Thing />
<svelte:component this={Thing} />
```

### Touch and wheel events are passive

When using `onwheel`, `onmousewheel`, `ontouchstart` and `ontouchmove` event attributes, the handlers are [passive](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners) to align with browser defaults. This greatly improves responsiveness by allowing the browser to scroll the document immediately, rather than waiting to see if the event handler calls `event.preventDefault()`.

In the very rare cases that you need to prevent these event defaults, you should use [`on`](/docs/svelte/svelte-events#on) instead (for example inside an action).

### Attribute/prop syntax is stricter

In Svelte 4, complex attribute values needn't be quoted:

<!-- prettier-ignore -->
```svelte
<Component prop=this{is}valid />
```

This is a footgun. In runes mode, if you want to concatenate stuff you must wrap the value in quotes:

```svelte
<Component prop="this{is}valid" />
```

Note that Svelte 5 will also warn if you have a single expression wrapped in quotes, like `answer="{42}"` — in Svelte 6, that will cause the value to be converted to a string, rather than passed as a number.

### HTML structure is stricter

In Svelte 4, you were allowed to write HTML code that would be repaired by the browser when server side rendering it. For example you could write this...

```svelte
<table>
  <tr>
    <td>hi</td>
  </tr>
</table>
```

... and the browser would auto-insert a `<tbody>` element:

```svelte
<table>
  <tbody>
    <tr>
      <td>hi</td>
    </tr>
  </tbody>
</table>
```

Svelte 5 is more strict about the HTML structure and will throw a compiler error in cases where the browser would repair the DOM.

## Other breaking changes

### Stricter `@const` assignment validation

Assignments to destructured parts of a `@const` declaration are no longer allowed. It was an oversight that this was ever allowed.

### :is(...) and :where(...) are scoped

Previously, Svelte did not analyse selectors inside `:is(...)` and `:where(...)`, effectively treating them as global. Svelte 5 analyses them in the context of the current component. As such, some selectors may now be treated as unused if they were relying on this treatment. To fix this, use `:global(...)` inside the `:is(...)/:where(...)` selectors.

When using Tailwind's `@apply` directive, add a `:global` selector to preserve rules that use Tailwind-generated `:is(...)` selectors:

<!-- prettier-ignore -->
```css
main +++:global+++ {
  @apply bg-blue-100 dark:bg-blue-900;
}
```

### CSS hash position no longer deterministic

Previously Svelte would always insert the CSS hash last. This is no longer guaranteed in Svelte 5. This is only breaking if you [have very weird css selectors](https://stackoverflow.com/questions/15670631/does-the-order-of-classes-listed-on-an-item-affect-the-css).

### Scoped CSS uses :where(...)

To avoid issues caused by unpredictable specificity changes, scoped CSS selectors now use `:where(.svelte-xyz123)` selector modifiers alongside `.svelte-xyz123` (where `xyz123` is, as previously, a hash of the `<style>` contents). You can read more detail [here](https://github.com/sveltejs/svelte/pull/10443).

In the event that you need to support ancient browsers that don't implement `:where`, you can manually alter the emitted CSS, at the cost of unpredictable specificity changes:

```js
// @errors: 2552
css = css.replace(/:where\((.+?)\)/, '$1');
```

### Error/warning codes have been renamed

Error and warning codes have been renamed. Previously they used dashes to separate the words, they now use underscores (e.g. foo-bar becomes foo_bar). Additionally, a handful of codes have been reworded slightly.

### Reduced number of namespaces

The number of valid namespaces you can pass to the compiler option `namespace` has been reduced to `html` (the default), `mathml` and `svg`.

The `foreign` namespace was only useful for Svelte Native, which we're planning to support differently in a 5.x minor.

### beforeUpdate/afterUpdate changes

`beforeUpdate` no longer runs twice on initial render if it modifies a variable referenced in the template.

`afterUpdate` callbacks in a parent component will now run after `afterUpdate` callbacks in any child components.

Both functions are disallowed in runes mode — use `$effect.pre(...)` and `$effect(...)` instead.

### `contenteditable` behavior change

If you have a `contenteditable` node with a corresponding binding _and_ a reactive value inside it (example: `<div contenteditable=true bind:textContent>count is {count}</div>`), then the value inside the contenteditable will not be updated by updates to `count` because the binding takes full control over the content immediately and it should only be updated through it.

### `oneventname` attributes no longer accept string values

In Svelte 4, it was possible to specify event attributes on HTML elements as a string:

```svelte
<button onclick="alert('hello')">...</button>
```

This is not recommended, and is no longer possible in Svelte 5, where properties like `onclick` replace `on:click` as the mechanism for adding event handlers.

### `null` and `undefined` become the empty string

In Svelte 4, `null` and `undefined` were printed as the corresponding string. In 99 out of 100 cases you want this to become the empty string instead, which is also what most other frameworks out there do. Therefore, in Svelte 5, `null` and `undefined` become the empty string.

### `bind:files` values can only be `null`, `undefined` or `FileList`

`bind:files` is now a two-way binding. As such, when setting a value, it needs to be either falsy (`null` or `undefined`) or of type `FileList`.

### Bindings now react to form resets

Previously, bindings did not take into account `reset` event of forms, and therefore values could get out of sync with the DOM. Svelte 5 fixes this by placing a `reset` listener on the document and invoking bindings where necessary.

### `walk` no longer exported

`svelte/compiler` reexported `walk` from `estree-walker` for convenience. This is no longer true in Svelte 5, import it directly from that package instead in case you need it.

### Content inside `svelte:options` is forbidden

In Svelte 4 you could have content inside a `<svelte:options />` tag. It was ignored, but you could write something in there. In Svelte 5, content inside that tag is a compiler error.

### `<slot>` elements in declarative shadow roots are preserved

Svelte 4 replaced the `<slot />` tag in all places with its own version of slots. Svelte 5 preserves them in the case they are a child of a `<template shadowrootmode="...">` element.

### `<svelte:element>` tag must be an expression

In Svelte 4, `<svelte:element this="div">` is valid code. This makes little sense — you should just do `<div>`. In the vanishingly rare case that you _do_ need to use a literal value for some reason, you can do this:

```svelte
<svelte:element this=+++{+++"div"+++}+++>
```

Note that whereas Svelte 4 would treat `<svelte:element this="input">` (for example) identically to `<input>` for the purposes of determining which `bind:` directives could be applied, Svelte 5 does not.

### `mount` plays transitions by default

The `mount` function used to render a component tree plays transitions by default unless the `intro` option is set to `false`. This is different from legacy class components which, when manually instantiated, didn't play transitions by default.

### `<img src={...}>` and `{@html ...}` hydration mismatches are not repaired

In Svelte 4, if the value of a `src` attribute or `{@html ...}` tag differ between server and client (a.k.a. a hydration mismatch), the mismatch is repaired. This is very costly: setting a `src` attribute (even if it evaluates to the same thing) causes images and iframes to be reloaded, and reinserting a large blob of HTML is slow.

Since these mismatches are extremely rare, Svelte 5 assumes that the values are unchanged, but in development will warn you if they are not. To force an update you can do something like this:

```svelte
<script>
  let { markup, src } = $props();

  if (typeof window !== 'undefined') {
    // stash the values...
    const initial = { markup, src };

    // unset them...
    markup = src = undefined;

    $effect(() => {
      // ...and reset after we've mounted
      markup = initial.markup;
      src = initial.src;
    });
  }
</script>

{@html markup}
<img {src} />
```

### Hydration works differently

Svelte 5 makes use of comments during server side rendering which are used for more robust and efficient hydration on the client. As such, you shouldn't remove comments from your HTML output if you intend to hydrate it, and if you manually authored HTML to be hydrated by a Svelte component, you need to adjust that HTML to include said comments at the correct positions.

### `onevent` attributes are delegated

Event attributes replace event directives: Instead of `on:click={handler}` you write `onclick={handler}`. For backwards compatibility the `on:event` syntax is still supported and behaves the same as in Svelte 4. Some of the `onevent` attributes however are delegated, which means you need to take care to not stop event propagation on those manually, as they then might never reach the listener for this event type at the root.

### `--style-props` uses a different element

Svelte 5 uses an extra `<svelte-css-wrapper>` element instead of a `<div>` to wrap the component when using CSS custom properties.


