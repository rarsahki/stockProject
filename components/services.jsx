import { useRouter } from "next/router";

export const Services = (props) => {
  const router = useRouter();
  return (
    <div id='services' className='text-center'>
      <div className='container'>
        <div className='section-title'>
          <h2>Our Services</h2>
        </div>
        <div className='row justify-content-evenly'>
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className='col-4' style={{cursor:'pointer'}} onClick={() => i==0?router.push('/'):router.push('/similar')}>
                  {' '}
                  <i className={d.icon}></i>
                  <div className='service-desc'>
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                  </div>
                </div>
              ))
            : 'loading'}
        </div>
      </div>
    </div>
  )
}
