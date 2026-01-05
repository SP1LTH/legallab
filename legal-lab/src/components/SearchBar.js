// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ handleSearch, searchTerm, isDarkMode }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isSearchIcon, setIsSearchIcon] = useState(true);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
    console.log("Updated SearchBar term:", searchTerm); // Debugging line
  }, [searchTerm]);

  const onSubmit = (event) => {
    event.preventDefault();
    handleSearch(localSearchTerm);
    setIsSearchIcon(false);
  };

  const onClear = () => {
    setLocalSearchTerm('');
    setIsSearchIcon(true);
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
      <TextField
        variant="outlined"
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
        placeholder="Бүтээлийн сангаас хайх..."
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={isSearchIcon ? onSubmit : onClear}>
                {isSearchIcon ? <SearchIcon /> : <ClearIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ 
          width: '100%', 
          marginRight: '10px', 
          backgroundColor: isDarkMode ? 'black' : 'white', 
          color: isDarkMode ? 'white' : 'black' 
        }}
      />
    </form>
  );
};

export default SearchBar;
