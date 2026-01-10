import { Text } from '../../ui/Text';

interface SectionHeaderProps {
  title: string;
  description: string;
}

export const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <div>
      <Text as="h2" size="lg" variant='primary'>{title}</Text>
      <Text as="span" size="sm" variant='tertiary'>{description}</Text>
    </div>
  )
}

