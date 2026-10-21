### Semester 5 — Lesson 1: TypeScript + React mental model

#### TypeScript runtime model

- TypeScript is transformed into JavaScript before browser execution.
- Type-only constructs such as `interface` are erased at runtime.
- JSX/TSX is transformed into JavaScript that creates React element descriptions.

#### React component model

- A function component is invoked again on each render.
- Components return React element descriptions, not DOM directly.
- `<Component />` creates a React-managed component boundary.
- Calling `Component()` directly is just a normal JavaScript function call.

#### Props

- Props flow from parent to child.
- Parent owns/provides prop values.
- Child treats props as input/read-only data.

#### Local variables vs state

```text
local variable
→ belongs to one render invocation
→ not preserved across rerenders

React state
→ preserved by React across renders
```

#### `useState`

```tsx
const [count, setCount] = useState(0);
```

- `count` = state snapshot for the current render.
- `setCount(...)` schedules a state update.
- State is not mutated immediately inside the current handler.

#### Functional state updates

```tsx
setCount(count + 1);
```

uses the current render snapshot.

```tsx
setCount((c) => c + 1);
```

uses the latest queued state value.

Use functional updates when the new state depends on previous state.

#### Render lifecycle

```text
event handler
→ schedule state update
→ handler finishes
→ render
→ DOM commit
→ effect
```

#### `useEffect`

- Used to synchronize React with external systems/state.
- Examples: browser APIs, timers, WebSockets, event listeners, external libraries, network side effects.
- Runs after render/commit.
- Avoid it for values directly derivable from existing props/state.

Prefer:

```tsx
const fullName = `${firstName} ${lastName}`;
```

over maintaining duplicated derived state with an effect.

#### Effect dependencies

- Dependency array controls when the effect runs again.
- It does not control whether React rerenders.
- `setState` may schedule rerendering.
- Repeatedly setting the same state value can let React bail out.

#### Component state isolation

- Each rendered component identity has its own state.
- Two `<Counter />` components do not share state unless state is lifted/shared explicitly.

### Semester 5 — Lesson 2: React data flow and state design

#### State ownership

- Shared state should usually live in the nearest common parent.
- Keep one source of truth; avoid duplicated state across parent/child components.

#### Lifting state up

```text
Parent owns state
→ passes values down through props
→ passes callbacks down for child-triggered updates
```

#### Controlled inputs

```tsx
<input value={name} onChange={(e) => setName(e.target.value)} />
```

- React state is the source of truth.
- `value` controls what is displayed.
- `onChange` updates React state.

#### Child → parent communication

- Parent passes a function as a prop.
- Child calls that function to request a state change.

```tsx
<HeroList onHeroSelected={setSelectedHeroId} />
```

#### Derived state

Avoid storing values that can be calculated from existing state/props.

Prefer:

```tsx
const fullName = `${firstName} ${lastName}`;
```

over duplicated `fullName` state.

#### Object state updates

Treat React state as immutable.

Prefer:

```tsx
setForm((current) => ({
  ...current,
  name: "Jaina",
}));
```

Avoid:

```tsx
form.name = "Jaina";
setForm(form);
```

- `...current` copies fields into a new object.
- React state setters replace object state; they do not automatically merge it.

#### Props copied into state

```tsx
const [name, setName] = useState(hero.name);
```

- `hero.name` is only used as the initial state value.
- Later prop changes do not automatically reset local state.
- Copying props into state can create two sources of truth.

#### Resetting local state

Use `key={hero.id}` when changing entity means a new component identity:

```tsx
<HeroEditor key={hero.id} hero={hero} />
```

A changed key:

```text
old component unmounts
→ new component mounts
→ local state initializes again
```

Use explicit reset when the same component/entity should keep its identity.

#### Forms

```tsx
event.preventDefault();
```

- Prevents the browser's native form submission/navigation.
- Lets React handle submission logic itself.

#### Request state

Typical request-related state:

```text
form
→ user input

loading
→ request in progress

error
→ request failure

response data
→ state only if UI needs to retain/render it
```

#### `fetch`

```tsx
const response = await fetch(...);

if (!response.ok) {
    throw new Error(...);
}
```

- Network failure → Promise rejects.
- HTTP 4xx/5xx → Promise usually resolves.
- `response.ok` is true for successful 2xx responses.

### Semester 5 — Lesson 3: React async data fetching and server state

#### Local state vs server state

- Local UI state is owned by the frontend.
- Server state is owned by the backend; the frontend only holds a local snapshot/cache.
- Server state can become stale independently of React.

#### Fetching with `useEffect`

```tsx
useEffect(() => {
  fetch("/api/heroes");
}, []);
```

- An empty dependency array means the effect does not depend on changing props/state.
- In this case, it is used to fetch data after mount.

#### Fetch lifecycle

Typical concerns:

```text
loading
data
error
HTTP status
cancellation
race conditions
```

#### `fetch()` behavior

- Network failure → Promise rejects.
- HTTP `4xx` / `5xx` → Promise usually resolves.
- Check `response.ok` explicitly.

```tsx
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}
```

#### Race conditions

Request order does not guarantee response order.

```text
request A starts
request B starts

B returns first
A returns later

→ stale A can overwrite newer B
```

Example:

```text
search = "art"
→ request A

search = "arthas"
→ request B

B returns first
→ UI shows "arthas"

A returns later
→ UI incorrectly goes back to "art"
```

#### `AbortController`

```tsx
const controller = new AbortController();

fetch(url, {
  signal: controller.signal,
});
```

- Used to cancel stale or no-longer-needed requests.
- Particularly useful when an effect dependency changes before the previous request finishes.

#### Effect cleanup

```tsx
return () => {
  controller.abort();
};
```

The cleanup runs:

- before that effect runs again because its dependencies changed;
- when the component unmounts.

General pattern:

```text
effect
→ start / acquire something

cleanup
→ stop / release it
```

Examples:

- start request → abort request;
- register event listener → remove event listener;
- start timer → clear timer.

#### Abort errors

- Cancelling an old request is expected behavior.
- An `AbortError` should normally not be shown to the user as a real application failure.

#### Overlapping loading state

This can be subtly wrong:

```tsx
.finally(() => {
    setLoading(false);
});
```

Example:

```text
request A starts
request B starts

A is aborted / finishes
→ A sets loading = false

B is still running
→ UI incorrectly says loading = false
```

Request lifecycle state must therefore be associated carefully with the active request.

#### Derived server data

Prefer:

```tsx
const visibleHeroes = heroes.filter((hero) => hero.name.includes(search));
```

over storing another synchronized state.

If a value can be calculated directly from existing state/props, it usually should not become another state variable.

#### Scaling concern

Do not manually reimplement the full server-state lifecycle in every component.

At scale, concerns such as:

- fetching;
- loading;
- errors;
- caching;
- retries;
- stale data;
- refetching;
- race conditions;
- cancellation;

are often centralized into:

- custom hooks;
- an API/data layer;
- server-state abstractions/libraries.

The low-level mechanics are still important to understand so those abstractions do not become "magic".

### Semester 5 — Lesson 4: Component lifecycle, effects, and cleanup

#### Component lifecycle

```text
mount
→ rerender / update
→ rerender / update
→ ...
→ unmount
```

- Rerender keeps the same component identity and preserves local state.
- Remount creates a new component identity and resets local state.

#### Effect execution

No dependency array:

```tsx
useEffect(() => {
    ...
});
```

- Runs after every committed render.

Empty dependency array:

```tsx
useEffect(() => {
    ...
}, []);
```

- Runs after mount.
- Does not rerun because of normal state/prop changes.
- Cleanup runs on unmount.

Dependency array:

```tsx
useEffect(() => {
    ...
}, [roomId]);
```

- Runs after mount.
- Runs again when `roomId` changes.

#### Effect cleanup

Cleanup runs:

```text
before the effect runs again because dependencies changed
or
when the component unmounts
```

General pattern:

```text
effect
→ start / register / acquire something

cleanup
→ stop / unregister / release it
```

Examples:

```text
setInterval
→ clearInterval

addEventListener
→ removeEventListener

connect WebSocket
→ disconnect WebSocket

start fetch
→ abort fetch
```

#### Dependency change vs remount

Dependency change:

```text
same component
→ rerender
→ cleanup previous effect
→ run new effect
→ local state preserved
```

Key change:

```tsx
<HeroEditor key={hero.id} />
```

```text
old component unmounts
→ local state discarded
→ new component mounts
→ fresh state initialized
```

#### Stale closures

Functions created during a render capture that render's values.

Example:

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    console.log(count);
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

If the effect was created when:

```text
count = 0
```

and never recreated, the callback can keep observing that old snapshot even after `count` changes.

#### Core distinction

```text
rerender
≠
remount

effect cleanup/restart
≠
component unmount/remount
```

### Semester 5 — Lesson 5: React routing and navigation

#### React Router role

React Router maps the current URL to React UI:

```text
URL
→ route match
→ component/page
```

It also enables client-side SPA navigation without a full document reload.

#### Route parameters

```tsx
<Route path="/heroes/:heroId" element={<HeroDetailsPage />} />
```

`:heroId` is a dynamic route parameter.

Examples:

```text
/heroes/42
/heroes/99
```

Inside the component:

```tsx
const { heroId } = useParams();
```

Route parameters are typically strings.

#### `<Link>` vs `<a>`

```tsx
<Link to="/heroes/42">
```

- Uses React Router.
- Client-side navigation.
- No full document reload.

```html
<a href="/heroes/42"></a>
```

- Normal browser navigation.
- Browser requests a new document from the server.
- React application reloads.

#### Direct navigation and SPA fallback

If the user directly enters:

```text
https://myapp.com/heroes/42
```

the request goes first to the web server:

```text
browser
→ GET /heroes/42
→ web server
```

React Router is not running yet.

For SPA routes, the server usually needs a fallback:

```text
frontend route
→ serve index.html
→ React starts
→ React Router handles the URL
```

Without that fallback, the server may return `404`.

#### Route parameter changes

If:

```text
/heroes/42
→ /heroes/99
```

matches the same route component:

```tsx
<Route path="/heroes/:heroId" ... />
```

the component does not necessarily remount.

Usually:

```text
same component stays mounted
→ rerender
→ heroId changes
→ local state preserved
```

Effects whose dependencies changed may rerun.

#### Route-driven fetching

```tsx
const { heroId } = useParams();

useEffect(() => {
  fetch(`/api/heroes/${heroId}`);
}, [heroId]);
```

When `heroId` changes:

```text
component rerenders
→ effect runs again
→ new fetch starts
```

The previous fetch is not automatically cancelled.

Cancellation requires explicit cleanup, for example with `AbortController`.

#### Nested routes and layouts

```tsx
<Route element={<AppLayout />}>
  <Route path="/heroes" element={<HeroesPage />} />
  <Route path="/settings" element={<SettingsPage />} />
</Route>
```

`<Outlet />` marks where the matched child route renders:

```tsx
function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
```

#### Persistent layout state

If the layout remains mounted while child routes change, its local state is preserved.

```text
AppLayout stays mounted
→ child route changes
→ layout state survives
```

State only survives if the component owning that state also survives.

#### Relative nested routes

```tsx
<Route path="/heroes">
  <Route index element={<HeroesPage />} />
  <Route path=":heroId" element={<HeroDetailsPage />} />
</Route>
```

Corresponds to:

```text
index
→ /heroes

:heroId
→ /heroes/:heroId
```
