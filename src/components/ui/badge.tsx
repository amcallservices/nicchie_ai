import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-zinc-700 bg-zinc-800 text-zinc-100',
        secondary:
          'border-zinc-700 bg-zinc-800/50 text-zinc-300',
        destructive:
          'border-red-900 bg-red-900/20 text-red-400',
        outline:
          'border-zinc-600 text-zinc-300',
        success:
          'border-emerald-900 bg-emerald-900/20 text-emerald-400',
        warning:
          'border-amber-900 bg-amber-900/20 text-amber-400',
        violet:
          'border-violet-900 bg-violet-900/20 text-violet-400',
        cyan:
          'border-cyan-900 bg-cyan-900/20 text-cyan-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }