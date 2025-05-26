export default function Input({ label, type, name, value, onChange }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>
        {label}
        <input
          style={{ display: 'block', padding: '0.5rem', marginTop: '0.25rem', width: '100%' }}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
        />
      </label>
    </div>
  );
}