import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });

  const onBlur = () => {
    const value = parseFloat(price);
    setPrice(value.toFixed(2));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div>
      <h1 className="mt-5">Create a ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group mt-4">
          <label htmlFor="title">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            type="text"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
            type="number"
            min="0"
          />
        </div>
        {errors}
        <button className="btn btn-primary mt-3">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
