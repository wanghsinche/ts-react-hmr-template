// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import App from './App';

import {cartesianProductOf} from './lib/math'

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });


it('cartesianProduction', ()=>{
  console.log(cartesianProductOf([1,2],[3,4],[5,6]))
  console.log(cartesianProductOf(['122','12'],[3,4],[5,6]))
  console.log(cartesianProductOf(['Android'],['0','1']))
})