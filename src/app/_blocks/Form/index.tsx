'use client'
import React, { useState, useCallback } from 'react'
import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'
import { Form as FormType } from '@payloadcms/plugin-form-builder/dist/types'
import RichText from '@/app/_components/RichText'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Gutter } from '@/app/_components/Gutter'
import { Button } from '@/app/_components/Button'

import classes from './index.module.scss'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Value | Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: {
    [k: string]: unknown
  }[]
  borderTop?: string
  borderRight?: string
  borderBottom?: string
  borderLeft?: string
}

export const FormBlock: React.FC<FormBlockType & { id?: string }> = (props) => {
  const {
    enableIntro,
    introContent,
    form: formFromProps,
    form: { id: formID, submitButtonLabel, confirmationType, redirect, confirmationMessage, title } = {},
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
  } = props

  //console.log('FormBlock props:', props) // Debugging statement

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps.fields),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)
  const [error, setError] = useState<{ status?: string; message: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    async (data: Data) => {
      //console.log('Form data submitted:', data) // Debugging statement

      let loadingTimerID: NodeJS.Timer

      setError(undefined)

      const dataToSend = Object.entries(data).map(([name, value]) => ({
        field: name,
        value,
      }))

      loadingTimerID = setTimeout(() => {
        setIsLoading(true)
      }, 1000)

      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/form-submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            form: formID,
            submissionData: dataToSend,
          }),
        })

        const res = await req.json()

        clearTimeout(loadingTimerID)

        if (req.status >= 400) {
          setIsLoading(false)
          setError({
            status: res.status,
            message: res.errors?.[0]?.message || 'Internal Server Error',
          })
          return
        }

        setIsLoading(false)
        setHasSubmitted(true)

        if (confirmationType === 'redirect' && redirect) {
          const { url } = redirect
          if (url) router.push(url)
        }
      } catch (err) {
        console.warn(err)
        setIsLoading(false)
        setError({
          message: 'Something went wrong.',
        })
      }
    },
    [router, formID, redirect, confirmationType]
  )

  return (
    <Gutter className={`${classes.noPadding}`}>
      <div
        className={[classes.form, hasSubmitted && classes.hasSubmitted].filter(Boolean).join(' ')}
      >
        {title && !hasSubmitted && (
          <h3 className={classes.formHeading}>{title}</h3>
        )}
        {enableIntro && introContent && !hasSubmitted && (
          <RichText className={classes.intro} content={introContent} />
        )}
        {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
        {hasSubmitted && confirmationType === 'message' && confirmationMessage && (
          <RichText className={classes.confirmationMessage} content={confirmationMessage} />
        )}
        {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
        {!hasSubmitted && (
          <form id={formID} onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.fieldWrap}>
              {formFromProps.fields.map((field, index) => {
                //console.log('Rendering field:', field) // Debugging statement
                const Field = fields[field.blockType]
                return Field ? (
                  <Field
                    key={index}
                    form={formFromProps}
                    {...field}
                    {...formMethods}
                    register={register}
                    errors={errors}
                    control={control}
                  />
                ) : null
              })}
            </div>
            <Button label={submitButtonLabel} appearance="primary" el="button" form={formID} />
          </form>
        )}
      </div>
    </Gutter>
  )
}
