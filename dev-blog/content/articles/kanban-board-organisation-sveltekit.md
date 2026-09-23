---
title: "Kanban-Board Organisation mit SvelteKit"
slug: "kanban-board-organisation-sveltekit"
publishedAt: "2026-09-23"
date: "2026-09-23"
featured: false
tags: ["sveltekit", "svelte5", "typescript", "zod"]
excerpt: "Wie ich mit SvelteKit, Zod und nativem HTML5-Drag-and-Drop ein einfaches Kanban-Board für meine eigenen Dev-Tasks erstelle."
image: "https://images.unsplash.com/photo-1760548425425-e42e77fa38f1?fm=jpg&q=60&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0"
imageAlt: "Nahaufnahme eines dunklen Code-Editors mit farbig hervorgehobenem JavaScript-Code"
category: "SvelteKit"
readTime: "5 min"
---

## Ein Kanban-Board für eigene Dev-Tasks

Ich wollte ein kleines Tool, um meine eigenen Aufgaben – Refactorings, Organisatorisches, Programmieraufgaben – nicht mehr in einer losen Notiz-App zu sammeln, sondern in einem echten Board mit Spalten und Drag-and-Drop. Quasi ein eigenes privates **DevBoard**: SvelteKit im Backend und Frontend, Zod für die Validierung, und eine simple JSON-Datei als Speicher. Kein Framework-Overkill, pragmatische Architektur.

### Datenmodell mit Zod

Der erste Schritt war, die Form eines Tasks zu definieren – und zwar nicht als TypeScript-Interface, sondern als Zod-Schema, aus dem sich der Typ automatisch ableiten lässt. So existiert die Form nur an einer Stelle:

```ts
export const TaskCategory = z.enum(['Refactoring', 'Organisation']);
export const TaskPriority = z.enum(['Low', 'Mid', 'High']);
export const TaskStatus = z.enum(['Todo', 'In Progress', 'Done']);

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  category: TaskCategory,
  priority: TaskPriority,
  status: TaskStatus,
  createdAt: z.coerce.date(),
});

export type Task = z.infer<typeof TaskSchema>;
```

Für das Erstellen eines Tasks gibt es ein abgeleitetes Schema ohne `id` und `createdAt`, weil beide Felder serverseitig erzeugt werden:

```ts
export const NewTaskSchema = TaskSchema.omit({ id: true, createdAt: true });
```

Jede Formulareingabe läuft vor dem Speichern durch `NewTaskSchema.safeParse(...)` – ungültige Daten kommen gar nicht erst bis zum Speicherpunkt durch.

### Board-Layout und Spalten

Das Board selbst gruppiert Tasks client-seitig nach Status in drei Spalten (Todo, In Progress, Done). Mit Svelte 5 Runes lässt sich das ganz direkt als abgeleiteter Zustand ausdrücken:

```ts
let tasksByStatus = $derived(
  Object.fromEntries(
    STATUSES.map((status) => [status, filteredTasks.filter((t) => t.status === status)])
  )
);
```

Dazu kommen Filter-Chips nach Kategorie und eine kleine Statistik-Leiste, die die Verteilung der Tasks über die drei Status anzeigt – auch das rein über `$derived`-Werte, ohne manuelles Neu-Berechnen bei jeder Änderung.

### Neue Tasks anlegen

Neue Tasks entstehen über ein Modal mit einem klassischen SvelteKit-Formular, das progressiv mit `use:enhance` angereichert ist. Der zugehörige Form-Action validiert die rohen `FormData` und reicht sie erst nach erfolgreicher Prüfung weiter:

```ts
createTask: async ({ request }) => {
  const formData = await request.formData();
  const raw = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    priority: formData.get('priority'),
    status: formData.get('status'),
  };

  const result = NewTaskSchema.safeParse(raw);
  if (!result.success) {
    return fail(400, { data: raw, errors: result.error.flatten().fieldErrors });
  }

  const task = { id: randomUUID(), createdAt: new Date(), ...result.data };
  await createTask(task);
  return { success: true, task };
}
```

Validierungsfehler kommen als Teil des `form`-Objekts zurück und werden im Formular direkt unter dem jeweiligen Feld angezeigt.

### Drag-and-Drop für Status-Wechsel

Den Status eines Tasks ändert man per Drag-and-Drop zwischen den Spalten – ganz ohne externe Library, nur mit den nativen HTML5-Drag-Events:

```svelte
<article
  draggable="true"
  ondragstart={() => handleDragStart(task.id)}
  ondragend={handleDragEnd}
>
```

Jede Spalte ist gleichzeitig Drop-Ziel. Beim Drop wird eine `FormData` mit `id` und neuem `status` an einen eigenen Form-Action gesendet:

```ts
moveTask: async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get('id');
  const status = formData.get('status');

  const result = TaskStatus.safeParse(status);
  if (!result.success) {
    return fail(400, { error: 'Invalid status' });
  }

  await updateTaskStatus(id as string, result.data);
  return { success: true };
}
```

Aktuell lädt die Seite nach einem erfolgreichen Drop komplett neu (`location.reload()`) – funktional, aber nicht die eleganteste Lösung. Ein Wechsel auf SvelteKits eingebaute Invalidierung steht auf der Liste offener Punkte.

### Persistenz als JSON-Datei

Statt einer Datenbank reicht für ein Ein-Personen-Tool erstmal eine flache JSON-Datei, die bei jeder Änderung komplett neu geschrieben wird:

```ts
const dataFile = path.resolve('static/tasks.json');

export async function getTasks(): Promise<Task[]> {
  const file = await readFile(dataFile, 'utf-8');
  return file.trim() ? JSON.parse(file) : [];
}

export async function createTask(task: Task) {
  const tasks = await getTasks();
  tasks.push(task);
  await writeFile(dataFile, JSON.stringify(tasks, null, 2), 'utf-8');
  return task;
}
```

Das hat einen klaren Nachteil: Es gibt kein Locking, gleichzeitige Schreibvorgänge könnten sich theoretisch überschreiben. Für den aktuellen Einsatzzweck – ein lokales Tool für die eigene Aufgabenliste – ist das ein akzeptabler Kompromiss, der sich bei Bedarf später gegen eine Datenbank austauschen lässt.

Damit steht das Grundgerüst: Tasks anlegen, filtern, per Drag-and-Drop durch die Spalten schieben, alles typsicher validiert und persistiert. Im nächsten Teil geht es um das Bearbeiten bestehender Tasks.