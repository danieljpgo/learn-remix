export default function NewJokeRoute() {
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" name="name" />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea id="content" name="content" />
        </div>
        <div>
          <button type="submit" className="button">
            add
          </button>
        </div>
      </form>
    </div>
  );
}
