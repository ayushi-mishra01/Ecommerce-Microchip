// import React, { forwardRef } from 'react'

// import classes from './index.module.scss'

// type Props = {
//   children: React.ReactNode
//   className?: string
//   left?: boolean
//   right?: boolean
// }

// export const Gutter = forwardRef<HTMLDivElement, Props>((props, ref) => {
//   const { children, className, left = true, right = true } = props

//   return (
//     <div
//       className={[
//         classes.gutter,
//         left && classes.gutterLeft,
//         right && classes.gutterRight,
//         className,
//       ]
//         .filter(Boolean)
//         .join(' ')}
//       ref={ref}
//     >
//       {children}
//     </div>
//   )
// })

// Gutter.displayName = 'Gutter'

import React, { forwardRef, Ref } from 'react'

import classes from './index.module.scss'

type Props = {
  left?: boolean
  right?: boolean
  className?: string
  children: React.ReactNode
  ref?: Ref<HTMLDivElement>
}

export const Gutter: React.FC<Props> = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { left = true, right = true, className, children } = props

  return (
    <div
      ref={ref}
      className={[
        classes.gutter,
        left && classes.gutterLeft,
        right && classes.gutterRight,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
})

Gutter.displayName = 'Gutter'
