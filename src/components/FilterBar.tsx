
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (value: string) => void;
}

const FilterBar = ({ searchTerm, onSearchChange, selectedCity, onCityChange }: FilterBarProps) => {
  const cities = [
    "All Cities",
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "Austin, TX"
  ];

  return (
    <div className="w-full bg-card/50 backdrop-blur border border-border/40 rounded-lg p-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artists, venues, or events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background/50 border-border/60 focus:border-primary"
          />
        </div>

        {/* City Filter */}
        <div className="md:w-48">
          <Select value={selectedCity} onValueChange={onCityChange}>
            <SelectTrigger className="bg-background/50 border-border/60 focus:border-primary">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Button */}
        <Button variant="outline" className="md:w-auto border-border/60 hover:bg-accent">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
