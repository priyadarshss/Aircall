'use client'
import { useState, useEffect } from 'react'
import Logo from '../../components/Logo'

const BASE_URL = 'https://cerulean-marlin-wig.cyclic.app/'

const LandingPage = () => {
  const [calls, setCalls] = useState([])
  const [archivedCalls, setArchivedCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCallIds, setSelectedCallIds] = useState([])
  const [activeTab, setActiveTab] = useState('activityFeed')

  useEffect(() => {
    fetch(`${BASE_URL}activities`)
      .then((response) => response.json())
      .then((data) => {
        setCalls(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setLoading(false)
      })
  }, [])

  const updateCallStatus = (callId, isArchived) => {
    // below code commented out since the api endpoint isnt working properly i.e., it doesnt update the is_archived field

    // fetch(`${BASE_URL}activities/${callId}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ is_archived: isArchived }),
    // }).then(() => {
    //   const updatedCalls = calls.map((call) =>
    //     call.id === callId ? { ...call, is_archived: isArchived } : call
    //   )
    //   setCalls(updatedCalls)

    //   const updatedArchivedCalls = isArchived
    //     ? [...archivedCalls, updatedCalls.find((call) => call.id === callId)]
    //     : archivedCalls.filter((call) => call.id !== callId)

    //   setArchivedCalls(updatedArchivedCalls)
    // })

    const updatedCalls = calls.filter((call) => call.id !== callId)
    setCalls(updatedCalls)
  }

  const archiveCall = (callId) => {
    updateCallStatus(callId, true)
  }

  const unarchiveCall = (callId) => {
    updateCallStatus(callId, false)
  }

  const archiveAllCalls = () => {
    calls.forEach((call) => {
      if (!call.is_archived) {
        archiveCall(call.id)
      }
    })
  }

  const unarchiveAllCalls = () => {
    archivedCalls.forEach((call) => {
      unarchiveCall(call.id)
    })
  }

  const toggleDetails = (callId) => {
    if (selectedCallIds.includes(callId)) {
      setSelectedCallIds((prevIds) => prevIds.filter((id) => id !== callId))
    } else {
      setSelectedCallIds((prevIds) => [...prevIds, callId])

      fetch(`${BASE_URL}activities/${callId}`)
        .then((response) => response.json())
        .then((data) => {
          setSelectedCallDetails((prevDetails) => [...prevDetails, data])
        })
        .catch((error) => {
          console.error('Error fetching call details:', error)
        })
    }
  }

  return (
    <div className='bg-gray-100 text-gray-800 min-h-screen flex flex-col items-center justify-center'>
      <Logo />
      <div className='overflow-auto h-[500px]'>
        <div className='max-w-md min-w-[800px] pt-16 p-4 bg-white shadow-lg rounded-md mb-8 flex flex-col items-center justify-center'>
          <div className='flex bg-white items-center relative justify-between mb-2 mt-2'>
            <div className='border-2 border-red-900 rounded-lg pl-2 pr-2 absolute bottom-0 -left-20 flex justify-center items-center'>
              <button
                className={`${
                  activeTab === 'activityFeed'
                    ? 'text-xl font-bold text-red-800'
                    : 'text-gray-700 hover:text-red-800'
                } transition duration-300 ease-in-out`}
                onClick={() => setActiveTab('activityFeed')}
              >
                Activity Feed
              </button>
              <div className='border-[1px] mr-4 ml-4 border-red-900 h-8'></div>
              <button
                className={`${
                  activeTab === 'archivedCalls'
                    ? 'text-xl font-bold text-red-800'
                    : 'text-gray-700 hover:text-red-800'
                } transition duration-300 ease-in-out`}
                onClick={() => setActiveTab('archivedCalls')}
              >
                Archived Calls
              </button>
            </div>
          </div>

          {activeTab === 'activityFeed' && (
            <div className='w-3/4 p-4 bg-white shadow-lg rounded-md mb-8'>
              <div className='flex items-center justify-between mb-4'>
                <h1 className='text-xl font-bold'>Activity Feed</h1>
                <button
                  className='text-red-500 hover:text-red-700 px-4 py-2 rounded-md'
                  onClick={archiveAllCalls}
                >
                  Archive all calls
                </button>
              </div>

              {loading ? (
                <div className='flex justify-center items-center'>
                  <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black'></div>
                </div>
              ) : (
                <ul>
                  {calls.map((call) => (
                    <li
                      key={call.id}
                      className='mb-4 p-2 border-b border-gray-300'
                    >
                      <div className='flex justify-between items-center mb-2'>
                        <span className='flex justify-around w-full items-center space-x-2'>
                          <span
                            className={`text-${
                              call.direction == 'inbound' ? 'green' : 'blue'
                            }-500`}
                          >
                            {call.direction === 'inbound'
                              ? 'Incoming'
                              : 'Outgoing'}
                          </span>
                          <span>
                            Call from {call.from} to {call.to}
                          </span>
                          {call.call_type && (
                            <span
                              className={`text-${
                                call.call_type === 'missed' ? 'red' : 'gray'
                              }-500`}
                            >
                              (
                              {call.call_type.charAt(0).toUpperCase() +
                                call.call_type.slice(1)}
                              )
                            </span>
                          )}
                        </span>

                        <div className='flex flex-col justify-end'>
                          <button
                            className='text-blue-500 hover:text-blue-700 px-4 py-2 rounded-md mr-2'
                            onClick={() => archiveCall(call.id)}
                          >
                            Archive
                          </button>
                          {/* create a divide line below */}
                          <div className='border-[1px] mr-4 ml-4 border-gray-400'></div>
                          <button
                            className='text-blue-500 hover:text-blue-700 px-4 py-2 rounded-md'
                            onClick={() => toggleDetails(call.id)}
                          >
                            {selectedCallIds.includes(call.id)
                              ? 'Hide Details'
                              : 'Show Details'}
                          </button>
                        </div>
                      </div>
                      {selectedCallIds.includes(call.id) && (
                        <div className='call-details bg-gray-100 p-4 rounded-md mt-2'>
                          <p>ID: {call.id}</p>
                          <p>Direction: {call.direction}</p>
                          <p>From: {call.from}</p>
                          <p>To: {call.to}</p>
                          <p>Via: {call.via}</p>
                          <p>Duration: {call.duration} seconds</p>
                          <p>Call Type: {call.call_type}</p>
                          <p>Archived: {call.is_archived ? 'Yes' : 'No'}</p>
                          <p>Created At: {call.created_at}</p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'archivedCalls' && (
            <div className='max-w-md p-4 bg-white shadow-lg rounded-md'>
              <h1 className='text-xl font-bold mb-4'>Archived Calls</h1>
              {archivedCalls.map((call) => (
                <div
                  key={call.id}
                  className='flex justify-between items-center mb-2'
                >
                  <span>
                    {call.direction === 'inbound' ? 'Inbound' : 'Outbound'} Call
                    from {call.from} to {call.to} ({call.call_type})
                  </span>
                  <button
                    className='text-blue-500 hover:text-blue-700 px-4 py-2 rounded-md'
                    onClick={() => unarchiveCall(call.id)}
                  >
                    Unarchive
                  </button>
                </div>
              ))}
              <button
                className='bg-red-500 text-white px-4 py-2 rounded-md mt-4'
                onClick={unarchiveAllCalls}
              >
                Unarchive All Calls
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LandingPage
