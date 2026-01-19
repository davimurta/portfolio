'use client';

import React, { useState } from 'react';
import { Button } from '../Button';
import { CustomSelect } from '../CustomSelect';
import { ArrowUpRight } from 'lucide-react';
import './contactForm.css';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission (send to API)
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
          required
        />
      </div>

      <div className="form-submit">
        <Button type="submit" variant="primary" icon={ArrowUpRight}>
          View case
        </Button>
      </div>
    </form>
  );
}
