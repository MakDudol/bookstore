import './Search.css'

function Search({ value, onChange }) {
  return (
    <div className="search">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Пошук за назвою чи автором"
        aria-label="Пошук книжок"
      />
    </div>
  )
}

export default Search
