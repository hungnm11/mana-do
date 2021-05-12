import React, { useState } from 'react';
import './signin.css';
import { useHistory } from 'react-router-dom';
import Service from '../../service';

const SignInPage = () => {
  const [form, setForm] = useState({
    userId: '',
    password: '',
  });
  const history = useHistory();

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resp = await Service.signIn(form.userId, form.password);

    localStorage.setItem('token', resp);
    history.push('/todo');
  };

  const onChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <p className='sign'>Sign in</p>
      <form onSubmit={signIn} className='form1'>
        <input
          placeholder='User id'
          id='user_id'
          name='userId'
          value={form.userId}
          className='un'
          onChange={onChangeField}
        />

        <input
          placeholder='Password'
          id='password'
          className='pass'
          name='password'
          type='password'
          value={form.password}
          onChange={onChangeField}
        />

        <button type='submit' style={{ marginTop: 12 }} className='submit'>
          Sign in
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
