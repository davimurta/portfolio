'use client';

import React, { useState } from 'react';
import { Button } from '../Button';
import { CustomSelect } from '../CustomSelect';
import { Send, Check, Loader2 } from 'lucide-react';
import './contactForm.css';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar mensagem');
      }

      setStatus('success');
      setFormData({ name: '', email: '', projectType: '', message: '' });

      // Reset success state after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao enviar mensagem');
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'loading':
        return 'Sending...';
      case 'success':
        return 'Message sent!';
      default:
        return 'Send message';
    }
  };

  const getButtonIcon = () => {
    switch (status) {
      case 'loading':
        return Loader2;
      case 'success':
        return Check;
      default:
        return Send;
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={status === 'loading'}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={status === 'loading'}
            required
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="projectType">Project type:</label>
        <CustomSelect
          id="projectType"
          name="projectType"
          value={formData.projectType}
          onChange={handleSelectChange}
          placeholder="Select a project type"
          options={[
            { value: 'web', label: 'Web Development' },
            { value: 'mobile', label: 'Mobile Development' },
            { value: 'design', label: 'Design' },
            { value: 'consulting', label: 'Consulting' },
            { value: 'other', label: 'Other' }
          ]}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          disabled={status === 'loading'}
          required
        />
      </div>

      {status === 'error' && (
        <div className="form-error">
          {errorMessage}
        </div>
      )}

      <div className="form-submit">
        <Button
          type="submit"
          variant={status === 'success' ? 'secondary' : 'primary'}
          icon={getButtonIcon()}
          disabled={status === 'loading' || status === 'success'}
        >
          {getButtonContent()}
        </Button>
      </div>
    </form>
  );
}
