"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function FormManagementPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>Form Management</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Form Management & Validation Patterns
        </Heading>
        <Text className={styles.subtitle}>
          Production-ready form handling with React Hook Form, Zod validation, complex form patterns, multi-step forms, dynamic forms, and form state management. Learn patterns used in enterprise applications.
        </Text>
      </div>

      {/* React Hook Form Patterns */}
      <section id="react-hook-form" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"📝"} 1. React Hook Form Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                {"⚡"} Tired of forms that re-render on every keystroke? React Hook Form is your best friend {"—"} performant, flexible, and so lightweight {"it's"} almost unfair! Build forms that {"don't"} make your browser cry. {"😂🏎️"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> {"—"} Forms are everywhere in web apps {"—"} get them right and your whole app feels snappier!
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> register & handleSubmit {"•"} Form validation rules {"•"} Error display {"•"} Custom validation functions
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Basic React Hook Form
import { useForm } from 'react-hook-form';

interface FormData {
  email: string;
  password: string;
  age: number;
}

function LoginForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// ✅ Advanced: Custom validation
function AdvancedForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

  const password = watch('password');

  const validatePasswordMatch = (value: string) => {
    return value === password || 'Passwords do not match';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('password', {
          required: 'Password required',
          validate: {
            hasUpperCase: (v) => 
              /[A-Z]/.test(v) || 'Must contain uppercase',
            hasNumber: (v) => 
              /[0-9]/.test(v) || 'Must contain number'
          }
        })}
      />
      
      <input
        {...register('confirmPassword', {
          validate: validatePasswordMatch
        })}
      />
    </form>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Zod Schema Validation */}
      <section id="zod-validation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🔒"} 2. Zod Schema Validation
              </Heading>
              <Text className={styles.sectionDescription}>
                {"🎯"} Why write validation logic twice (once in TS types, once in validation rules) when Zod does both? Define your schema once, get TypeScript types AND runtime validation for free! {"It's"} like a two-for-one deal that actually works. {"🤝✨"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> {"—"} Type-safe validation eliminates an entire category of runtime bugs before they reach production!
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Zod schema definition {"•"} zodResolver integration {"•"} Type inference with z.infer {"•"} Nested object validation
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Zod + React Hook Form
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

const userSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password too short'),
  age: z.number().min(18, 'Must be 18+').max(120),
  website: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).min(1, 'At least one tag required')
});

type UserFormData = z.infer<typeof userSchema>;

function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password', { valueAsNumber: false })} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <input 
        type="number" 
        {...register('age', { valueAsNumber: true })} 
      />
      {errors.age && <span>{errors.age.message}</span>}
    </form>
  );
}

// ✅ Complex nested validation
const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().regex(/^\\d{5}$/, 'Invalid ZIP code')
});

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().positive()
  })).min(1),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  useBillingForShipping: z.boolean()
}).refine(
  (data) => data.billingAddress || !data.useBillingForShipping,
  {
    message: 'Billing address required',
    path: ['billingAddress']
  }
);`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Multi-step Forms */}
      <section id="multi-step-forms" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🪜"} 3. Multi-step Forms
              </Heading>
              <Text className={styles.sectionDescription}>
                {"🧙"} Giant forms scare users away! Break them into bite-sized steps and suddenly that 20-field form feels like a breezy wizard. Validate at each step, navigate back and forth, and keep all data in one place with FormProvider. {"Nobody's"} abandoning THIS checkout flow! {"🛒✨"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> {"—"} Multi-step forms dramatically improve completion rates for complex workflows like checkout and onboarding!
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Step-based form architecture {"•"} Per-step validation with trigger {"•"} FormProvider context {"•"} Step indicator UI
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Multi-step form with React Hook Form
import { useForm, FormProvider } from 'react-hook-form';

const steps = [
  { id: 'personal', title: 'Personal Info' },
  { id: 'address', title: 'Address' },
  { id: 'payment', title: 'Payment' }
];

function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      personal: { name: '', email: '' },
      address: { street: '', city: '' },
      payment: { card: '', cvv: '' }
    }
  });

  const { trigger, getValues } = methods;

  const nextStep = async () => {
    const stepFields = {
      personal: ['personal.name', 'personal.email'],
      address: ['address.street', 'address.city'],
      payment: ['payment.card', 'payment.cvv']
    };

    const isValid = await trigger(
      stepFields[steps[currentStep].id] as any
    );

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <StepIndicator currentStep={currentStep} steps={steps} />
        
        {currentStep === 0 && <PersonalInfoStep />}
        {currentStep === 1 && <AddressStep />}
        {currentStep === 2 && <PaymentStep />}
        
        <div>
          {currentStep > 0 && (
            <button type="button" onClick={prevStep}>Previous</button>
          )}
          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={nextStep}>Next</button>
          ) : (
            <button type="submit">Submit</button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function PersonalInfoStep() {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div>
      <input {...register('personal.name', { required: true })} />
      <input {...register('personal.email', { required: true })} />
    </div>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Dynamic Forms */}
      <section id="dynamic-forms" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🔀"} 4. Dynamic Forms
              </Heading>
              <Text className={styles.sectionDescription}>
                {"🎭"} Sometimes you {"don't"} know how many fields {"you'll"} need {"—"} and {"that's"} okay! With <code>useFieldArray</code>, users can add and remove fields on the fly. Think {"\""}Add another team member{"\""} or {"\""}Add another address.{"\""} Dynamic forms that just work! {"➕➖"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔵"} <strong>Impact: MEDIUM</strong> {"—"} Dynamic forms unlock flexible UIs for invoices, team management, and any repeatable data entry!
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> useFieldArray hook {"•"} Dynamic append & remove {"•"} Conditional field rendering {"•"} watch for reactive fields
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Dynamic field arrays
import { useFieldArray, useForm } from 'react-hook-form';

interface FormData {
  users: Array<{ name: string; email: string }>;
}

function DynamicUserForm() {
  const { control, register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      users: [{ name: '', email: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users'
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            {...register(\`users.\${index}.name\` as const, {
              required: 'Name required'
            })}
            placeholder="Name"
          />
          <input
            {...register(\`users.\${index}.email\` as const, {
              required: 'Email required'
            })}
            placeholder="Email"
          />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => append({ name: '', email: '' })}
      >
        Add User
      </button>
      
      <button type="submit">Submit</button>
    </form>
  );
}

// ✅ Conditional fields
function ConditionalForm() {
  const { watch, register } = useForm();
  const hasAddress = watch('hasAddress');

  return (
    <form>
      <label>
        <input type="checkbox" {...register('hasAddress')} />
        Has address
      </label>
      
      {hasAddress && (
        <>
          <input {...register('street')} placeholder="Street" />
          <input {...register('city')} placeholder="City" />
        </>
      )}
    </form>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

