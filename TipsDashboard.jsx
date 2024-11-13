//demo

import React from 'react'
import TipTable from './TipTable'
import Filter from '../Call/Filter'


const TipsDashboard = () => {
  return (
    <div className='w-full h-full mt-10 md:mt-20'>
        <h1 className=' font-semibold text-2xl mb-4'>Dashboard &gt; Tips</h1>
       
      <Filter />
    <TipTable />
    </div>
  )
}

export default TipsDashboard
