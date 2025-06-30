import React, { useState, ChangeEvent, FormEvent } from 'react';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    jobTitle: '',
    address: '',
    age: '',
    phone: '',
    educationLevel: '',
    salaryExpectations: '',
    resume: null as File | null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const educationOptions = [
    { value: '', label: 'Select education level' },
    { value: 'HIGH_SCHOOL', label: 'High School' },
    { value: 'BACHELORS', label: 'Bachelors' },
    { value: 'MASTERS', label: 'Masters' },
    { value: 'PHD', label: 'PhD' },
    { value: 'OTHER', label: 'Other' },
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.surname) newErrors.surname = 'Surname is required';
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Valid email is required';
    if (!form.jobTitle) newErrors.jobTitle = 'Job Title is required';
    if (!form.phone || !/^[\d\-\+\s\(\)]+$/.test(form.phone)) newErrors.phone = 'Valid phone is required';
    if (!form.educationLevel) newErrors.educationLevel = 'Education Level is required';
    if (!form.salaryExpectations || isNaN(Number(form.salaryExpectations))) newErrors.salaryExpectations = 'Salary must be a number';
    if (form.age && (!/^[0-9]+$/.test(form.age) || Number(form.age) < 0)) newErrors.age = 'Age must be a positive integer';
    if (form.resume) {
      const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowed.includes(form.resume.type)) newErrors.resume = 'Only PDF or DOCX allowed';
      if (form.resume.size > 5 * 1024 * 1024) newErrors.resume = 'File must be ≤ 5MB';
    }
    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === 'resume') {
      setForm(f => ({ ...f, resume: files && files[0] ? files[0] : null }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'resume' && v) data.append(k, v as File);
        else if (k !== 'resume') data.append(k, v as string);
      });
      const res = await fetch('/api/candidates', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        setToast({ message: 'Candidate added successfully!', type: 'success' });
        setShowModal(false);
        setForm({ name: '', surname: '', email: '', jobTitle: '', address: '', age: '', phone: '', educationLevel: '', salaryExpectations: '', resume: null });
      } else {
        const err = await res.json();
        setToast({ message: err.error || (err.errors && err.errors[0]?.msg) || 'Error adding candidate', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Logo placeholder */}
        <div style={{ marginTop: 32, marginBottom: 16 }}>
          <div style={{ width: 80, height: 80, background: '#222', borderRadius: '50%', display: 'inline-block', marginBottom: 8 }}></div>
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#111', marginBottom: 32 }}>Talent Finder</h1>
        <button onClick={() => setShowModal(true)} style={{ margin: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}>Add Candidate</button>
        {showModal && (
          <div className="modal-backdrop" style={{ position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
            <div className="modal" role="dialog" aria-modal="true" style={{ background:'#fff', padding:32, borderRadius:10, minWidth:600, maxWidth:700, width:'100%', boxShadow:'0 2px 16px rgba(0,0,0,0.15)' }}>
              <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Add Candidate</h2>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '18px 16px', alignItems: 'center' }}>
                <label htmlFor="name">First Name*:</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} />
                {errors.name && <div className="error" style={{ gridColumn: '2/3' }}>{errors.name}</div>}

                <label htmlFor="surname">Last Name*:</label>
                <input id="surname" name="surname" value={form.surname} onChange={handleChange} />
                {errors.surname && <div className="error" style={{ gridColumn: '2/3' }}>{errors.surname}</div>}

                <label htmlFor="email">Email*:</label>
                <input id="email" name="email" value={form.email} onChange={handleChange} />
                {errors.email && <div className="error" style={{ gridColumn: '2/3' }}>{errors.email}</div>}

                <label htmlFor="jobTitle">Job Title*:</label>
                <input id="jobTitle" name="jobTitle" value={form.jobTitle} onChange={handleChange} />
                {errors.jobTitle && <div className="error" style={{ gridColumn: '2/3' }}>{errors.jobTitle}</div>}

                <label htmlFor="address">Address:</label>
                <input id="address" name="address" value={form.address} onChange={handleChange} />
                {errors.address && <div className="error" style={{ gridColumn: '2/3' }}>{errors.address}</div>}

                <label htmlFor="age">Age:</label>
                <input id="age" name="age" value={form.age} onChange={handleChange} />
                {errors.age && <div className="error" style={{ gridColumn: '2/3' }}>{errors.age}</div>}

                <label htmlFor="phone">Phone*:</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
                {errors.phone && <div className="error" style={{ gridColumn: '2/3' }}>{errors.phone}</div>}

                <label htmlFor="educationLevel">Education Level*:</label>
                <select id="educationLevel" name="educationLevel" value={form.educationLevel} onChange={handleChange}>
                  {educationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors.educationLevel && <div className="error" style={{ gridColumn: '2/3' }}>{errors.educationLevel}</div>}

                <label htmlFor="salaryExpectations">Salary Expectations*:</label>
                <input id="salaryExpectations" name="salaryExpectations" value={form.salaryExpectations} onChange={handleChange} />
                {errors.salaryExpectations && <div className="error" style={{ gridColumn: '2/3' }}>{errors.salaryExpectations}</div>}

                <label htmlFor="resume">Resume (PDF/DOCX, ≤5MB):</label>
                <input id="resume" name="resume" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleChange} />
                {form.resume && <span style={{ fontSize:12, gridColumn: '2/3' }}>{form.resume.name}</span>}
                {errors.resume && <div className="error" style={{ gridColumn: '2/3' }}>{errors.resume}</div>}

                <div style={{ gridColumn: '1/3', display:'flex', gap:12, justifyContent:'flex-end', marginTop: 16 }}>
                  <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
                  <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {toast && (
          <div className="toast" style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background: toast.type==='success'?'#4caf50':'#f44336', color:'#fff', padding:'12px 24px', borderRadius:4, zIndex:2000 }}>
            {toast.message}
            <button style={{ marginLeft:12, background:'none', border:'none', color:'#fff', fontWeight:'bold', cursor:'pointer' }} onClick={() => setToast(null)}>X</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
