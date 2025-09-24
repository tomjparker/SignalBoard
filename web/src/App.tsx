import { useEffect, useState } from 'react';
import { createIssue, InvokeApi } from './lib/api';

export default function App() {

  const [taskState, setTaskState] = useState<boolean>(false)
  const [ap]

  useEffect(() => {

  }) []

  return (
    <div className="page">
      <h1>Frontend GUI</h1>
      <button onClick={createIssue()} />
    </div>
  )
}