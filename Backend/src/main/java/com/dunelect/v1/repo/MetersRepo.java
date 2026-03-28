package com.dunelect.v1.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dunelect.v1.models.Meters;

public interface MetersRepo extends JpaRepository<Meters,Integer>  {

}
