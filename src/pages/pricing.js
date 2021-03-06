import React from 'react'
import PricingSection from 'components/PricingSection'
import WidgetSSO from './widgetsso'

function PricingPage (props) {
  return (
    <>
      <PricingSection
        bg='white'
        textColor='dark'
        size='md'
        bgImage=''
        bgImageOpacity={1}
        title='Pricing'
        subtitle='Choose the plan that makes sense for you. All plans include a 14-day free trial.'
      />
    </>
  )
}

export default PricingPage
