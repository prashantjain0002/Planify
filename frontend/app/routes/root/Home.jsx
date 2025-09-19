import { Button } from '@/components/ui/button';
import React from 'react'

export function meta({}) {
  return [
    { title: "Planify" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const HomePage = () => {
  return (
    <div>HomePage <Button>Click</Button></div>
  )
}

export default HomePage