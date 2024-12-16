import zod from 'zod'

const querySchema = zod.object({
  email: zod
    .string({ required_error: 'El parámetro "email" es requerido.' })
    .email({ message: 'El email no es válido' }),
  date: zod
    .string({ required_error: 'El parámetro "date" es requerido.' })
    .regex(/^(0[1-9]|1[0-2])-\d{4}$/, { message: 'La fecha debe estar en formato MM-YYYY' })
    .refine((val) => {
      const [month, year] = val.split('-').map(Number)
      return month >= 1 && month <= 12 && year > 0
    }, { message: 'La fecha no es válida' })
})

export function validateQuerySchema (object) {
  try {
    const queryValidation = querySchema.parse(object)
    return { success: true, data: queryValidation }
  } catch (error) {
    return { success: false, error: error.issues[0]?.message || 'Unknow error' }
  }
}
